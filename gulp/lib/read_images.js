'use strict';

var fs = require('fs'),
	path = require('path'),
	config = require('../config');

module.exports = function(dir, target){
	dir = path.normalize(dir);
	if (!fs.existsSync(dir)) return;

	config.symlink.targets.push({
		src: dir,
		dest: path.normalize(__dirname + '/../../public/img/' + target)
	});
};
