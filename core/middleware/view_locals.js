'use strict';

var cache = require('../cache');

module.exports = function(req, res, next){
	res.locals.navigation = cache.get('navigation');
	res.locals.user = req.user;
	next();
};
