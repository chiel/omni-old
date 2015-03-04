'use strict';

module.exports = function(){
	var router = require('express').Router();

	router.get('/', function(req, res){
		res.render('$dashboard/index');
	});

	return router;
};
