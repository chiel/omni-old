'use strict';

var fs = require('fs');
var path = require('path');
var config = require('../config');
var readImages = require('./read_images');
var readScripts = require('./read_scripts');
var readStyles = require('./read_styles');
var readTemplates = require('./read_templates');

module.exports = function(dir, target){
	dir = path.normalize(dir);

	readImages(dir + '/assets/images', target);
	readScripts(dir + '/assets/scripts', target);
	readStyles(dir + '/assets/styles', target);
	readTemplates(dir + '/templates', target);

	if (fs.existsSync(dir + '/gulp.js')){
		config.gulpfiles.push(dir + '/gulp.js');
	}
};
