'use strict';

var fs = require('fs'),
	path = require('path'),
	dest = path.normalize(__dirname + '/../public/js/omni.js');

module.exports = function(config, dir){
	if (!fs.existsSync(dir) || !fs.existsSync(dir + '/index.js')) return;

	if (!config.browserify.omni.files[dest]){
		config.browserify.omni.files[dest] = [];
	}

	config.browserify.omni.files[dest].push(dir + '/index.js');

	var filePath, hasSubdirs;

	fs.readdirSync(dir)
	.forEach(function(fileName){
		filePath = dir + '/' + fileName;
		if (fs.statSync(filePath).isDirectory()){
			hasSubdirs = true;
		}
	});

	config.watch.js_omni.files.push(dir + '/*.js');
	if (hasSubdirs){
		config.watch.js_omni.files.push(dir + '/**/*.js');
	}
};
