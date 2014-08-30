'use strict';

var express = require('express');

module.exports = function(modulePath, manifest){
	var router = express.Router();

	router.get('/', function(req, res){
		res.render(modulePath + '/views/list', {
			unit: manifest.unit,
			units: manifest.units,
			listSpec: manifest.listSpec,
			mount: manifest.mount
		});
	});

	router.get('/new/', function(req, res){
		res.render(modulePath + '/views/form', {
			unit: manifest.unit,
			units: manifest.units,
			formSpec: manifest.formSpec
		});
	});

	return router;
};
