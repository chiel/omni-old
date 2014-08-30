'use strict';

var express = require('express');

module.exports = function(modulePath, manifest){
	var router = express.Router();

	router.get('/', function(req, res){
		res.render(modulePath + '/views/list', {
			module: manifest.name,
			listSpec: manifest.listSpec,
			mount: manifest.mount
		});
	});

	router.get('/new/', function(req, res){
		res.render(modulePath + '/views/form', {
			formSpec: manifest.formSpec
		});
	});

	return router;
};
