'use strict';

module.exports = function(gulp, config){
	gulp.task('watch', function(){
		var globs = config.styles.targets.map(function(target){
			return target.watch;
		}).reduce(function(a, b){
			return a.concat(b);
		});

		gulp.watch(globs, [ 'styles' ]);
	});
};
