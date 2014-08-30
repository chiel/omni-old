'use strict';

var express = require('express'),
	mongoose = require('mongoose'),
	fs = require('fs'),
	config = require('../../core/config'),
	db = mongoose.connection;

module.exports = function(modulePath, manifest){
	var router = express.Router(),
		schema, Model;

	if (fs.existsSync(modulePath + '/schema.js')){
		schema = require(modulePath + '/schema');
	}

	if (schema && manifest.model){
		Model = mongoose.model(manifest.model, schema);
	}

	router.get('/', function(req, res){
		var locals = {
			unit: manifest.unit,
			units: manifest.units,
			listSpec: manifest.listSpec,
			mount: manifest.mount
		};

		if (!Model){
			console.error('No model found for module %s', manifest.name);
			locals.error = 'No model found for this module';
			return res.render(modulePath + '/views/list', locals);
		}

		db.on('error', console.error);

		db.once('open', function() {
			Model.find(function(err, items){
				db.close();

				locals.items = items;
				res.render(modulePath + '/views/list', locals);
			});
		});
		mongoose.connect(config.mongo);
	});

	router.get('/new/', function(req, res){
		res.render(modulePath + '/views/form', {
			unit: manifest.unit,
			units: manifest.units,
			formSpec: manifest.formSpec
		});
	});

	router.post('/new/', function(req, res){
		if (!Model){
			console.error('No model found for module %s', manifest.name);
			return res.redirect('/' + manifest.mount + '/new/');
		}

		db.on('error', console.error);

		db.once('open', function() {
			new Model(req.body).save(function(err){
				if (err){
					console.log(err);
					return res.render(modulePath + '/views/form');
				}

				db.close();
				res.redirect('/' + manifest.mount + '/');
			});
		});
		mongoose.connect(config.mongo);
	});

	return router;
};
