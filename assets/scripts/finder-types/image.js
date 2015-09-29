'use strict';

var finderImage = require('finder.js/types/image');
var Focal = require('focal.js');

/**
 * @param {Element} panel
 * @param {Object} data
 * @param {Object} options
 */
var imageType = function(panel, data, options){
	finderImage(panel, data, options, function(){
		var img = panel.querySelector('img');
		var focal = new Focal(img);
	});
};

imageType.regex = finderImage.regex;

module.exports = imageType;
