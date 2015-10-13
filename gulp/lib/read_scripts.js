'use strict';

var fs = require('fs');
var path = require('path');
var config = require('../config');

module.exports = function(dir, target) {
	dir = path.normalize(dir);
	if (!fs.existsSync(dir)) return;

	if (fs.existsSync(dir + '/index.js')) {
		config.scripts.targets.push({
			input: dir + '/index.js',
			output: path.normalize(__dirname + '/../../public/js/' + target + '/index.js'),
			watch: [ dir + '/*.js', dir + '/**/*.js' ]
		});
	}
};
