'use strict';

var fs = require('fs'),
	map = require('mout/array/map'),
	Promise = require('promise'),
	uploads = require('path').normalize(__dirname + '/../../public/uploads');

var stat = function(file){
	return new Promise(function(resolve, reject){
		fs.stat(file, function(err, stats){
			if (err) return reject(err);

			resolve({
				absolute_path: file,
				relative_path: file.replace(uploads, ''),
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
				return dir + '/' + file;
			}));
		});
	});
};

module.exports = function(mod, generate){
	var router = generate(mod);

	router.get('/', function(req, res){
		readdir(uploads + (req.query.path || ''))
			.then(statFiles)
			.then(function(files){
				res.json(files);
			}, function(err){
				console.error(err);
			});
	});

	return router;
};
