'use strict';

var swig = require('gulp-swig');
var rename = require('gulp-rename');
var config = require('../config');

module.exports = function(gulp, config) {
	gulp.task('blocks', function() {
		return gulp.src(__dirname + '/../templates/blocks.js.tpl')
			.pipe(swig({ data: { blocks: config.blocks }}))
			.pipe(rename('blocks.js'))
			.pipe(gulp.dest(__dirname + '/../tmp/'));
	});
};
