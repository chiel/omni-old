'use strict';

var express = require('express'),
	mongoose = require('mongoose'),
	config = require('../../core/config'),
	db = mongoose.connection;

module.exports = function(mod){
	var router = express.Router();

	router.get('/', function(req, res){
		var locals = {
			unit: mod.manifest.unit,
			units: mod.manifest.units,
			listSpec: mod.manifest.listSpec,
			mount: mod.manifest.mount
		};

		if (!mod.Model){
			console.error('No model found for module %s', mod.manifest.name);
			locals.error = 'No model found for this module';
			return res.render(mod.path + '/views/list', locals);
		}

		db.on('error', console.error);

		db.once('open', function() {
			mod.Model.find(function(err, items){
				db.close();

				locals.items = items;
				res.render(mod.path + '/views/list', locals);
			});
		});
		mongoose.connect(config.mongo);
	});

	router.get('/new/', function(req, res){
		res.render(mod.path + '/views/form', {
			unit: mod.manifest.unit,
			units: mod.manifest.units,
			formSpec: mod.manifest.formSpec
		});
	});

	router.post('/new/', function(req, res){
		if (!mod.Model){
			console.error('No model found for module %s', mod.manifest.name);
			return res.redirect('/' + mod.manifest.mount + '/new/');
		}

		db.on('error', console.error);

		db.once('open', function() {
			new mod.Model(req.body).save(function(err){
				if (err){
					console.error(err);
					return res.render(mod.path + '/views/form');
				}

				db.close();
				res.redirect('/' + mod.manifest.mount + '/');
			});
		});
		mongoose.connect(config.mongo);
	});

	return router;
};
