'use strict';

module.exports = function(gulp, config){
	return function(){
		var jsGlobs = [], sassGlobs = [], targets, i, j;

		targets = config.browserify.targets;

		for (i = 0; i < targets.length; i++){
			for (j = 0; j < targets[i].watch.length; j++){
				jsGlobs.push(targets[i].watch[j]);
			}
		}

		gulp.watch(jsGlobs, ['browserify']);

		targets = config.sass.targets;

		for (i = 0; i < targets.length; i++){
			for (j = 0; j < targets[i].watch.length; j++){
				sassGlobs.push(targets[i].watch[j]);
			}
		}

		gulp.watch(sassGlobs, ['sass']);
	};
};
