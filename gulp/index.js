'use strict';

var fs = require('fs'),
	config = require('./config'),
	readCssDir = require('./readcssdir'),
	readJsDir = require('./readjsdir'),
	readImg = require('./readimg'),
	root = __dirname + '/..';

config.nodemon.watch.push(root);

readCssDir(root + '/assets/styles', 'omni');
readJsDir(root + '/assets/scripts', 'omni');
readImg(root + '/assets/images', 'omni');

module.exports = function(gulp){
	var match;
	fs.readdirSync(__dirname + '/tasks').forEach(function(fileName){
		match = fileName.match(/(.*)\.[^.]+/);
		gulp.task(match[1], require(__dirname + '/tasks/' + fileName)(gulp, config));
	});

	gulp.task('default', ['browserify', 'sass', 'symlink', 'watch', 'nodemon']);
	gulp.task('build', ['browserify', 'sass', 'symlink']);
};
