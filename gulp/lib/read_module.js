'use strict';

var fs = require('fs'),
	config = require('../config'),
	readImages = require('./read_images'),
	readScripts = require('./read_scripts'),
	readStyles = require('./read_styles');

var path = require('path');

module.exports = function(dir, target){
	dir = path.normalize(dir);

	readImages(dir + '/assets/images', target);
	readScripts(dir + '/assets/scripts', target);
	readStyles(dir + '/assets/styles', target);

	if (fs.existsSync(dir + '/gulp.js')){
		config.gulpfiles.push(dir + '/gulp.js');
	}
};
