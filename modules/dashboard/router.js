'use strict';

module.exports = function(mod) {
	var router = require('express').Router();

	router.get('/', function(req, res) {
		res.render('$dashboard/index', {
			manifest: mod.manifest
		});
	});

	return router;
};
