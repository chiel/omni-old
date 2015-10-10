'use strict';

var cache = require('../cache');
var config = require('../config');
var pkg = require('../../package.json');

module.exports = function(req, res, next){
	res.locals.config = {
		images: config.images
	};
	res.locals.navigation = cache.get('navigation');
	res.locals.package = pkg;
	res.locals.user = req.user;
	next();
};
