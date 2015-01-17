'use strict';

var fs = require('fs'),
	path = require('path'),
	config = require('./config');

module.exports = function(dir, target){
	dir = path.normalize(dir);
	if (!fs.existsSync(dir) || !fs.existsSync(dir + '/index.js')) return;

	var output = path.normalize(__dirname + '/../public/js/' + target + '/index.js'),
		watch = [dir + '/*.js'], filePath;

	fs.readdirSync(dir)
	.forEach(function(fileName){
		filePath = dir + '/' + fileName;
		if (fs.statSync(filePath).isDirectory()){
			watch.push(dir + '/**/*.js');
		}
	});

	config.browserify.targets.push({
		input: dir + '/index.js',
		output: output,
		watch: watch
	});
};
