'use strict';

var gm = require('gm');
var config = require('../../core/config');
var uploads = require('path').normalize(config.upload.path);

/**
 * calculateBounds
 *
 * @param {Number} width - Desired width
 * @param {Number} height - Desired height
 * @param {Number} maxWidth - Width of the image
 * @param {Number} maxHeight - Height of the image
 * @param {Number} x - Focal point x coord
 * @param {Number} y - Focal point y coord
 *
 * @return {Object}
 */
var calculateBounds = function(width, height, maxWidth, maxHeight, x, y){
	var newWidth = width;
	var newHeight = height;
	var ratio;

	if (newWidth < maxWidth && newHeight < maxHeight){
		ratio = maxWidth / newWidth;
		newWidth *= ratio;
		newHeight *= ratio;
	}
	if (newWidth > maxWidth){
		ratio = maxWidth / newWidth;
		newWidth *= ratio;
		newHeight *= ratio;
	}
	if (newHeight > maxHeight){
		ratio = maxHeight / newHeight;
		newWidth *= ratio;
		newHeight *= ratio;
	}

	var point = {
		x: (maxWidth / 100) * x,
		y: (maxHeight / 100) * y
	};

	var x = point.x - (newWidth / 2);
	var y = point.y - (newHeight / 2);
	if (x < 0){
		x = 0;
	}
	if ((x + newWidth) > maxWidth){
		x = maxWidth - newWidth;
	}

	if (y < 0){
		y = 0;
	}
	if ((y + newHeight) > maxHeight){
		y = maxHeight - newHeight;
	}

	return {
		width: newWidth,
		height: newHeight,
		x: x,
		y: y
	};
};

/**
 * @param {Module} mod
 * @param {Function[]} auth - Authentication middleware
 */
module.exports = function(mod, auth){
	var router = require('express').Router();

	router.get(/^\/images(?:\/([0-9]+)x([0-9]+))?(?:\/(contain|cover))?(.*)$/, auth, function(req, res, next){
		var width = req.params[0];
		var height = req.params[1];
		var mode = req.params[2] || 'cover';
		var path = req.params[3];

		var img = gm(uploads + path);

		var crop = function(x, y){
			if (x && y && width && height){
				return img.size(function(err, size){
					if (err){
						console.error(err);
						return;
					}

					var bounds = calculateBounds(
						width, height,
						size.width, size.height,
						x, y
					);

					img
						.crop(bounds.width, bounds.height, bounds.x, bounds.y)
						.resize(width, height)
						.stream().pipe(res);
				});
			}

			img.stream().pipe(res);
		};

		if (!width || !height){
			return crop();
		}

		mod.methods.findOne({ path: path }).then(
			function(item){
				crop(item.focus.x, item.focus.y);
			},
			function(err){
				if (err.name !== 'NotFoundError'){
					console.error(err);
				}

				crop(50, 50);
			}
		);
	});

	return router;
};
