'use strict';

var fs = require('fs');
var path = require('path');
var config = require('../config');

module.exports = function(dir, target){
	dir = path.normalize(dir);
	if (!fs.existsSync(dir)) return;

	var input, match, hasFiles,
		watch = [ dir + '/*.css' ];

	fs.readdirSync(dir)
	.forEach(function(fileName){
		if (/^_/.test(fileName)) return;

		input = dir + '/' + fileName;
		if (fs.statSync(input).isDirectory()){
			watch.push(dir + '/**/*.css');
			return;
		}

		match = fileName.match(/(.*)\.css$/);
		if (match) hasFiles = true;
	});

	if (hasFiles){
		config.styles.targets.push({
			src: dir + '/*.css',
			dest: path.normalize(__dirname + '/../../public/css/' + target),
			watch: watch
		});
	}
};
