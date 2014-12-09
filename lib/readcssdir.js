'use strict';

var fs = require('fs'),
	path = require('path');

module.exports = function(config, dir, target){
	if (!fs.existsSync(dir)) return;

	var input, hasSubdirs, match, output, count = 0, globs;

	fs.readdirSync(dir)
	.forEach(function(fileName){
		if (/^_/.test(fileName)) return;

		input = dir + '/' + fileName;
		if (fs.statSync(input).isDirectory()){
			hasSubdirs = true;
			return;
		}

		match = fileName.match(/(.*)\.scss$/);
		if (!match) return;

		if (!config.sass[target]){
			config.sass[target] = {files: {}};
		}

		output = path.normalize(__dirname + '/../public/css/' + target + '/' + match[1] + '.css');

		config.sass[target].files[output] = input;
		count ++;
	});

	if (count > 0){
		globs = [dir + '/*.scss'];
		if (hasSubdirs){
			globs.push(dir + '/**/*.scss');
		}
		config.watch['sass_' + target] = {
			files: globs,
			tasks: ['sass:' + target]
		};
	}
};
