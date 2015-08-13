'use strict';

var postcss = require('gulp-postcss');
var merge = require('merge-stream');
var sourcemaps = require('gulp-sourcemaps');

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
				require('postcss-hexrgba'),
				require('autoprefixer-core')({ browsers: [ 'last 2 versions' ]})
			]))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(target.dest));

			streams.push(stream);
		}

		return merge.apply(merge, streams);
	};
};
