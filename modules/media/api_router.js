'use strict';

var gm = require('gm');
var uploads = require('path').normalize(__dirname + '/../../public/uploads');

module.exports = function(mod, auth){
	var router = require('express').Router();

	router.get(/^\/images(?:\/([0-9]+)x([0-9]+))?(?:\/(contain|cover))?(.*)$/, auth, function(req, res, next){
		var width = req.params[0];
		var height = req.params[1];
		var mode = req.params[2] || 'cover';
		var path = req.params[3];

		var img = gm(uploads + path);

		if (width && height){
			if (mode === 'cover'){
				img.resize(width, height, '^')
				.gravity('Center')
				.crop(width, height);
			} else{
				img.resize(width, height);
			}
		}

		img.stream().pipe(res);
	});

	return router;
};
