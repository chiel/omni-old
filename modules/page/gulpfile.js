'use strict';

module.exports = function(gulp, config){
	var targets = config.browserify.targets;
	targets[targets.length - 1].watch.push(
		__dirname + '/node_modules/builder/*.js',
		__dirname + '/node_modules/builder/**/*.js'
	);
	config.browserify.aliases.builder = __dirname + '/node_modules/builder';
};
