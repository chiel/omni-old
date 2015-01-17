'use strict';

var sass = require('gulp-sass'),
	merge = require('merge-stream');

module.exports = function(gulp, config){
	return function(){
		var streams = [], i, stream, target;

		for (i = 0; i < config.sass.targets.length; i++){
			target = config.sass.targets[i];
			stream = gulp.src(target.src)
				.pipe(sass(config.sass.options))
				.pipe(gulp.dest(target.dest));

			streams.push(stream);
		}

		return merge.apply(merge, streams);
	};
};
