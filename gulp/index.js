'use strict';

var fs = require('fs'),
	config = require('./config'),
	readModule = require('./lib/read_module'),
	root = __dirname + '/..';

config.nodemon.watch.push(root);

readModule(root, 'omni');

fs.readdirSync(root + '/modules').forEach(function(moduleName){
	readModule(root + '/modules/' + moduleName, moduleName);
});

module.exports = function(gulp){
	var match;
	fs.readdirSync(__dirname + '/tasks').forEach(function(fileName){
		match = fileName.match(/(.*)\.[^.]+/);
		gulp.task(match[1], require(__dirname + '/tasks/' + fileName)(gulp, config));
	});

	config.gulpfiles.forEach(function(file){
		require(file)(gulp, config);
	});

	gulp.task('default', ['browserify', 'sass', 'symlink', 'watch', 'nodemon']);
	gulp.task('build', ['browserify', 'sass', 'symlink']);
};
