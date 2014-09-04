'use strict';

var express = require('express'),
	mongoose = require('mongoose'),
	config = require('../../core/config'),
	db = mongoose.connection;

db.on('error', console.error);

module.exports = function(mod){
	var router = express.Router();

	router.get('/', function(req, res){
		var locals = {
			manifest: mod.manifest
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
		mod.manifest.formSpec.action = '/' + mod.manifest.slug + '/new/';
		res.render(mod.path + '/views/form', {
			manifest: mod.manifest
		});
	});

	router.post('/new/', function(req, res){
		if (!mod.Model){
			console.error('No model found for module %s', mod.manifest.name);
			return res.redirect('/' + mod.manifest.slug + '/new/');
		}

		db.once('open', function(){
			new mod.Model(req.body).save(function(err){
				db.close();
				if (err){
					console.error(err);
					return res.render(mod.path + '/views/form', {
						manifest: mod.manifest,
						error: err.message,
						formData: req.body
					});
				}

				res.redirect('/' + mod.manifest.slug + '/');
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
				console.error('No document found with id %s', req.params.id);
				return res.redirect('/' + mod.manifest.slug + '/new/');
			}

			mod.manifest.formSpec.action = '/' + mod.manifest.slug + '/edit/' + req.params.id + '/';
			res.render(mod.path + '/views/form', {
				manifest: mod.manifest,
				formData: docs[0]
			});
		});
		mongoose.connect(config.mongo);
	});

	router.post('/edit/:id/', function(req, res){
		if (!mod.Model){
			console.error('No model found for module %s', mod.manifest.name);
			return res.redirect('/' + mod.manifest.slug + '/edit/' + req.params.id + '/');
		}

		mod.Model.update({_id: req.params.id}, req.body, function(err){
			db.close();
			if (err){
				console.error(err);
				mod.manifest.formSpec.action = '/' + mod.manifest.slug + '/edit/' + req.params.id + '/';
				return res.render(mod.path + '/views/form', {
					manifest: mod.manifest,
					formData: req.body
				});
			}

			res.redirect('/' + mod.manifest.slug + '/');
		});
		mongoose.connect(config.mongo);
	});

	router.get('/delete/:id/', function(req, res){
		if (!mod.Model){
			console.error('No model found for module %s', mod.manifest.name);
			return res.redirect('/' + mod.manifest.slug + '/');
		}

		mod.Model.remove({_id: req.params.id}, function(err){
			db.close();
			if (err){
				console.error(err);
			}
			res.redirect('/' + mod.manifest.slug + '/');
		});
		mongoose.connect(config.mongo);
	});

	return router;
};
