'use strict';

var express = require('express');

module.exports = function(mod){
	var router = express.Router();

	if (!mod.Model) return router;

	router.get('/', function(req, res){
		mod.Model.find(function(err, items){
			res.render(mod.path + '/views/list', {
				manifest: mod.manifest,
				items: items
			});
		});
	});

	router.get('/new/', function(req, res){
		mod.manifest.formSpec.action = '/' + mod.manifest.slug + '/new/';
		res.render(mod.path + '/views/form', {
			manifest: mod.manifest
		});
	});

	router.post('/new/', function(req, res){
		new mod.Model(req.body).save(function(err){
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

	router.get('/edit/:id/', function(req, res){
		mod.Model.find({_id: req.params.id}, function(err, docs){
			if (err){
				console.error(err);
				return res.redirect('/' + mod.manifest.slug + '/');
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
	});

	router.post('/edit/:id/', function(req, res){
		mod.Model.update({_id: req.params.id}, req.body, function(err){
			if (err){
				console.error(err);
				mod.manifest.formSpec.action = '/' + mod.manifest.slug + '/edit/' + req.params.id + '/';
				return res.render(mod.path + '/views/form', {
					manifest: mod.manifest,
					error: err.message,
					formData: req.body
				});
			}

			res.redirect('/' + mod.manifest.slug + '/');
		});
	});

	router.get('/delete/:id/', function(req, res){
		mod.Model.remove({_id: req.params.id}, function(err){
			if (err){
				console.error(err);
			}
			res.redirect('/' + mod.manifest.slug + '/');
		});
	});

	return router;
};
