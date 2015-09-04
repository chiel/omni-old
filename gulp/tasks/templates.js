'use strict';

var swig = require('gulp-swig');
var rename = require('gulp-rename');
var config = require('../config');

module.exports = function(gulp, config){
	gulp.task('templates', function(){
		return gulp.src(__dirname + '/../templates/templates.js.tpl')
			.pipe(swig({ data: { templates: config.templates }}))
			.pipe(rename('templates.js'))
			.pipe(gulp.dest(__dirname + '/../tmp/'));
	});
};
