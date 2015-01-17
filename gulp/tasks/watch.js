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

		for (i = 0; i < config.sass.length; i++){
			for (j = 0; j < config.sass[i].watch.length; j++){
				sassGlobs.push(config.sass[i].watch[j]);
			}
		}

		gulp.watch(sassGlobs, ['sass']);
	};
};
