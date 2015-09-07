'use strict';

var fs = require('fs');
var gutil = require('gulp-util');
var config = require('./config');
var readModule = require('./lib/read_module');
var root = __dirname + '/..';

config.nodemon.watch.push(root);

readModule(root, 'omni');

fs.readdirSync(root + '/modules').forEach(function(moduleName){
	readModule(root + '/modules/' + moduleName, moduleName);
});

module.exports = function(gulp){
	fs.readdirSync(__dirname + '/tasks').forEach(function(fileName){
		require(__dirname + '/tasks/' + fileName)(gulp, config);
	});

	config.gulpfiles.forEach(function(file){
		require(file)(gulp, config);
	});

	var tasks = [ 'scripts', 'styles', 'symlink' ];
	if (!gutil.env.production){
		tasks.push('nodemon', 'watch');
	}

	gulp.task('default', tasks);
};
