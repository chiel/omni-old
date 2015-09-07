'use strict';

var fs = require('fs');
var path = require('path');
var config = require('../config');

module.exports = function(dir, target){
	dir = path.normalize(dir);
	if (!fs.existsSync(dir)) return;

	if (fs.existsSync(dir + '/index.js')){
		var output = path.normalize(__dirname + '/../../public/js/' + target + '/index.js');
		var watch = [ dir + '/*.js', dir + '/**/*.js' ];

		config.scripts.targets.push({
			input: dir + '/index.js',
			output: output,
			watch: watch
		});
	}
};
