'use strict';

var express = require('express'),
	mongoose = require('mongoose'),
	mixIn = require('mout/object/mixIn'),
	config = require('../../core/config'),
	db = mongoose.connection;

db.on('error', console.error);

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

		mod.Model.find(function(err, items){
			db.close();

			locals.items = items;
			res.render(mod.path + '/views/list', locals);
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

		db.once('open', function(){
			new mod.Model(req.body).save(function(err){
				db.close();
				if (err){
					console.error(err);
					return res.render(mod.path + '/views/form');
				}

				res.redirect('/' + mod.manifest.mount + '/');
			});
		});
		mongoose.connect(config.mongo);
	});

	router.get('/edit/:id/', function(req, res){
		mod.Model.find({_id: req.params.id}, function(err, docs){
			db.close();

			if (err){
				console.error(err);
			}

			if (!docs.length){
				console.err('No document found with id %s', req.params.id);
				return res.redirect('/' + mod.manifest.mount + '/new/');
			}

			res.render(mod.path + '/views/form', {
				unit: mod.manifest.unit,
				units: mod.manifest.units,
				formSpec: mixIn(mod.manifest.formSpec, {
					action: '/' + mod.manifest.mount + '/edit/' + req.params.id + '/'
				}),
				formData: docs[0]
			});
		});
		mongoose.connect(config.mongo);
	});

	router.post('/edit/:id/', function(req, res){
		if (!mod.Model){
			console.error('No model found for module %s', mod.manifest.name);
			return res.redirect('/' + mod.manifest.mount + '/edit/' + req.params.id + '/');
		}

		mod.Model.update({_id: req.params.id}, req.body, function(err){
			db.close();
			if (err){
				console.error(err);
				return res.render(mod.path + '/views/form');
			}

			res.redirect('/' + mod.manifest.mount + '/');
		});
		mongoose.connect(config.mongo);
	});

	return router;
};
