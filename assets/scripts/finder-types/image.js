'use strict';

var disclose = require('../disclose');
var finderImage = require('finder.js/types/image');
var Focal = require('focal.js');
var Promise = require('promise');

/**
 * Update focus for given path
 *
 * @param {String} path
 * @param {Number} x
 * @param {Number} y
 */
var updateFocus = function(path, x, y){
	fetch('/media/focus/', {
		method: 'post',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({ path: path, focus: { x: x, y: y }})
	}).then(
		function(res){
			res.json().then(
				function(json){
					if (res.status < 200 || res.status > 299){
						disclose.error(json.error.message || json.error.type, { sticky: true });
					} else{
						disclose.success('Focus has been saved.');
					}
				}
			);
		}
	);
};

/**
 * @param {Element} panel
 * @param {Object} data
 * @param {Object} options
 */
var imageType = function(panel, data, options){
	finderImage(panel, data, options, function(){
		var img = panel.querySelector('img');

		var focal = new Focal(img);
		focal.on('change', function(x, y){
			updateFocus(data.relative_path, x, y);
		});
	});
};

imageType.regex = finderImage.regex;

module.exports = imageType;
