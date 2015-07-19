'use strict';

var fs = require('fs');
var config = require('./config');
var readModule = require('./lib/read_module');
var root = __dirname + '/..';

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

	gulp.task('default', [ 'browserify', 'sass', 'watch', 'nodemon' ]);
	gulp.task('build', [ 'browserify', 'sass' ]);
};
