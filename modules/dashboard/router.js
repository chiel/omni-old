'use strict';

module.exports = function(){
	var router = require('express').Router();

	router.get('/', function(req, res){
		res.render(__dirname + '/views/index');
	});

	return router;
};
