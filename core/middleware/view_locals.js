'use strict';

var cache = require('../cache');
var pkg = require('../../package.json');

module.exports = function(req, res, next){
	res.locals.navigation = cache.get('navigation');
	res.locals.package = pkg;
	res.locals.user = req.user;
	next();
};
