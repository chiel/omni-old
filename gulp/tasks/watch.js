'use strict';

module.exports = function(gulp, config){
	return function(){
		var jsGlobs = [], stylesGlobs = [], targets, i, j;

		targets = config.browserify.targets;

		for (i = 0; i < targets.length; i++){
			for (j = 0; j < targets[i].watch.length; j++){
				jsGlobs.push(targets[i].watch[j]);
			}
		}

		gulp.watch(jsGlobs, [ 'browserify' ]);

		targets = config.styles.targets;

		for (i = 0; i < targets.length; i++){
			for (j = 0; j < targets[i].watch.length; j++){
				stylesGlobs.push(targets[i].watch[j]);
			}
		}

		gulp.watch(stylesGlobs, [ 'styles' ]);
	};
};
