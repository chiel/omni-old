'use strict';

var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var merge = require('merge-stream');
var notify = require('gulp-notify');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');

module.exports = function(gulp, config) {
	gulp.task('styles', function() {
		var streams = [];
		var i, stream, target;

		for (i = 0; i < config.styles.targets.length; i++) {
			target = config.styles.targets[i];
			stream = gulp.src(target.src)
			.pipe(sourcemaps.init())
			.pipe(postcss([
				require('postcss-import')({ glob: true }),
				require('postcss-nested'),
				require('postcss-extend'),
				require('postcss-custom-properties'),
				require('postcss-calc')(),
				require('postcss-hexrgba'),
				require('postcss-clearfix'),
				require('postcss-color-function'),
				require('autoprefixer')({ browsers: [ 'last 2 versions' ]})
			]))
			.on('error', notify.onError(function(err) {
				return err.message;
			}))
			.pipe(gutil.env.production ? require('gulp-cssnano')() : gutil.noop())
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(target.dest))
			.pipe(livereload());

			streams.push(stream);
		}

		return merge.apply(merge, streams);
	});
};
