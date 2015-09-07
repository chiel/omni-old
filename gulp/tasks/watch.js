'use strict';

module.exports = function(gulp, config){
	gulp.task('watch', function(){
		var stylesGlobs = [];
		var targets = config.styles.targets;
		var j;

		for (var i = 0; i < targets.length; i++){
			for (j = 0; j < targets[i].watch.length; j++){
				stylesGlobs.push(targets[i].watch[j]);
			}
		}

		gulp.watch(stylesGlobs, [ 'styles' ]);
	});
};
