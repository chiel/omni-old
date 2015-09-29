'use strict';

var fs = require('fs');
var map = require('mout/array/map');
var Promise = require('promise');
var rtrim = require('mout/string/rtrim');
var config = require('../../core/config');
var uploads = require('path').normalize(config.upload.path);

var stat = function(file){
	return new Promise(function(resolve, reject){
		fs.stat(file, function(err, stats){
			if (err) return reject(err);

			var fullPath = file + (stats.isDirectory() ? '/' : '');

			resolve({
				absolute_path: fullPath,
				relative_path: fullPath.replace(uploads, ''),
				name: file.match(/[^\/]+$/)[0],
				type: stats.isFile() ? 'file' : 'directory',
				size: stats.size,
				modified: stats.mtime
			});
		});
	});
};

var statFiles = function(files){
	return new Promise(function(resolve, reject){
		Promise.all(map(files, stat)).then(resolve, reject);
	});
};

var readdir = function(dir){
	return new Promise(function(resolve, reject){
		fs.readdir(dir, function(err, files){
			if (err) return reject(err);

			resolve(map(files, function(file){
				return dir + file;
			}));
		});
	});
};

var readfile = function(path){
	return new Promise(function(resolve, reject){
		stat(path).then(resolve, reject);
	});
};

var readpath = function(path){
	return new Promise(function(resolve, reject){
		fs.stat(path, function(err, stats){
			if (err){
				return console.error(err);
			}
			if (stats.isDirectory()){
				readdir(path + '/').then(statFiles).then(function(files){
					resolve({
						type: 'directory',
						files: files
					});
				}, reject);
			} else{
				readfile(path).then(resolve, reject);
			}
		});
	});
};

module.exports = function(mod, generate){
	var router = require('express').Router();

	router.get('/', function(req, res){
		var path = rtrim(req.query.path || '', '/');

		readpath(uploads + path).then(function(data){
			res.json(data);
		}, function(err){
			console.error(err);
		});
	});

	router.post('/upload/', function(req, res){
		req.busboy.on('file', function(fieldname, file, filename){
			var dest = uploads + rtrim(req.query.path || '', '/') + '/' + filename;
			var stream = fs.createWriteStream(dest);
			file.pipe(stream);
		});

		req.busboy.on('finish', function(){
			res.json({ status: 'ok' });
		});

		req.pipe(req.busboy);
	});

	router.post('/focus/', function(req, res){
		mod.methods.updateFocus(req.body).then(
			function(){
				res.json({ status: 'ok' });
			},
			function(err){
				res
					.status(err.status || 500)
					.json({ error: err });
			}
		);
	});

	return router;
};
