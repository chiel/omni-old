'use strict';

var express = require('express'),
	fs = require('fs'),
	expandFields = require('../../lib/expandfields');

/**
 * Generate a router with standard CRUD functionality
 */
module.exports = function(mod){
	var router = express.Router(),
		listView = mod.path + '/views/list.html',
		formView = mod.path + '/views/form.html';

	if (!mod.Model) return router;
	if (!fs.existsSync(listView)) listView = 'layouts/list';
	if (!fs.existsSync(formView)) formView = 'layouts/form';

	router.get('/', function(req, res){
		if (!req.user.can('view', mod.dirName)){
			return res.send('You are not authorised to view this page');
		}

		mod.Model.find(function(err, items){
			res.render(listView, {
				manifest: mod.manifest,
				items: items
			});
		});
	});

	router.get('/new/', function(req, res){
		if (!req.user.can('create', mod.dirName)){
			return res.send('You are not authorised to view this page');
		}

		mod.manifest.formSpec.action = '/' + mod.manifest.slug + '/new/';

		expandFields(mod.manifest.formSpec.fields, function(err, fields){
			mod.manifest.formSpec.fields = fields;
			res.render(formView, {
				action: '/' + mod.manifest.slug + '/new/',
				manifest: mod.manifest
			});
		});
	});

	router.post('/new/', function(req, res){
		if (!req.user.can('create', mod.dirName)){
			return res.send('You are not authorised to view this page');
		}

		new mod.Model(req.body).save(function(err, doc){
			if (err){
				return res.json({
					error: {
						message: err.message
					}
				});
			}

			res.status(201)
				.location('/' + mod.manifest.slug + '/edit/' + doc._id + '/')
				.json(req.body);
		});
	});

	router.get('/edit/:id/', function(req, res){
		if (!req.user.can('update', mod.dirName)){
			return res.send('You are not authorised to view this page');
		}

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

			expandFields(mod.manifest.formSpec.fields, function(err, fields){
				mod.manifest.formSpec.fields = fields;
				res.render(formView, {
					action: '/' + mod.manifest.slug + '/edit/' + req.params.id + '/',
					manifest: mod.manifest,
					formData: docs[0]
				});
			});
		});
	});

	router.post('/edit/:id/', function(req, res){
		if (!req.user.can('update', mod.dirName)){
			return res.send('You are not authorised to view this page');
		}

		mod.Model.update({_id: req.params.id}, req.body, function(err){
			if (err){
				return res.json({
					error: {
						message: err.message
					}
				});
			}

			res.location('/' + mod.manifest.slug + '/edit/' + req.params.id + '/')
				.json(req.body);
		});
	});

	router.get('/delete/:id/', function(req, res){
		if (!req.user.can('delete', mod.dirName)){
			return res.send('You are not authorised to view this page');
		}

		mod.Model.remove({_id: req.params.id}, function(err){
			if (err){
				console.error(err);
			}
			res.redirect('/' + mod.manifest.slug + '/');
		});
	});

	return router;
};
