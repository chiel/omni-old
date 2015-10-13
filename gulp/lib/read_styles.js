'use strict';

var fs = require('fs');
var path = require('path');
var config = require('../config');

module.exports = function(dir, target) {
	dir = path.normalize(dir);
	if (!fs.existsSync(dir)) return;

	var files = fs.readdirSync(dir).filter(function(file) {
		return /^[^_.].*\.css$/.test(file);
	});

	if (files.length) {
		config.styles.targets.push({
			src: dir + '/*.css',
			dest: path.normalize(__dirname + '/../../public/css/' + target),
			watch: [ dir + '/*.css', dir + '/**/*.css' ]
		});
	}
};
