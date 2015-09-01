'use strict';

var postcss = require('gulp-postcss');
var merge = require('merge-stream');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

module.exports = function(gulp, config){
	return function(){
		var streams = [], i, stream, target;

		for (i = 0; i < config.styles.targets.length; i++){
			target = config.styles.targets[i];
			stream = gulp.src(target.src)
			.pipe(sourcemaps.init())
			.pipe(postcss([
				require('postcss-import')({ glob: true }),
				require('postcss-nested'),
				require('postcss-custom-properties'),
				require('postcss-calc')(),
				require('postcss-hexrgba'),
				require('postcss-clearfix'),
				require('postcss-color-function'),
				require('autoprefixer-core')({ browsers: [ 'last 2 versions' ]})
			]))
			.pipe(gutil.env.production ? require('gulp-cssnano')() : gutil.noop())
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(target.dest));

			streams.push(stream);
		}

		return merge.apply(merge, streams);
	};
};
