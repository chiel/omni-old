'use strict';

var fs = require('fs');
var path = require('path');
var config = require('../config');

module.exports = function(dir, target){
	dir = path.normalize(dir);
	if (!fs.existsSync(dir)) return;

	var files = fs.readdirSync(dir);
	for (var i = 0; i < files.length; i++){
		config.blocks.push(dir + '/' + files[i]);
	}
};
