'use strict';

var fs = require('fs');
var path = require('path');
var config = require('../config');

module.exports = function(dir, target){
	dir = path.normalize(dir);
	if (!fs.existsSync(dir)) return;

	var dirs = fs.readdirSync(dir);
	var meta;
	for (var i = 0; i < dirs.length; i++){
		if (!fs.existsSync(dir + '/' + dirs[i] + '/index.html')) continue;
		meta = require(dir + '/' + dirs[i] + '/meta.json');
		config.templates.push({
			type: dirs[i],
			name: meta.name,
			description: meta.description,
			path: dir + '/' + dirs[i]
		});
	};
};
