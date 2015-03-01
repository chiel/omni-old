'use strict';

var fs = require('fs'),
	path = require('path'),
	config = require('./config');

module.exports = function(dir, target){
	dir = path.normalize(dir);
	if (!fs.existsSync(dir)) return;

	if (fs.existsSync(dir + '/index.js')){
		var output = path.normalize(__dirname + '/../public/js/' + target + '/index.js'),
			watch = [ dir + '/*.js', dir + '/**/*.js' ];

		config.browserify.targets.push({
			input: dir + '/index.js',
			output: output,
			watch: watch
		});
	}

	if (fs.existsSync(dir + '/blocks.js')){
		config.browserify.blocks.push(dir + '/blocks.js');
	}
};
