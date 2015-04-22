'use strict';

var config = require('../config');
var fs = require('fs');
var path = require('path');

module.exports = function(dir, target){
	dir = path.normalize(dir);
	if (!fs.existsSync(dir)) return;

	fs.readdirSync(dir)
	.forEach(function(fileName){
		config.browserify.templates.push(dir + '/' + fileName);
	});
};
