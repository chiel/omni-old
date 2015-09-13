'use strict';

var express = require('express');
var fs = require('fs');

var AuthorizationError = require('../../../lib/error/authorization');

/**
 * Generate a middleware function that will check user's permissions
 *
 * @param {String} action
 * @param {String} mod
 *
 * @return {Function}
 */
var auth = function(action, mod){
	/**
	 * Check if the logged in user is allowed to perform this action
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @param {Function} next
	 */
	return function(req, res, next){
		if (req.user.can(action, mod)){
			return next();
		}

		if (req.headers.accept === 'application/json'){
			var err = new AuthorizationError('You are not authorised to do that');
			res.status(err.status).json({ error: err });
		} else{
			res.send('You are not authorised to view this page');
		}
	};
};

/**
 * Generate a router with standard CRUD functionality
 */
var generateRouter = function(mod){
	var router = express.Router();
	var listView = mod.path + '/views/list.html';
	var formView = mod.path + '/views/form.html';

	if (!mod.Model) return router;
	if (!fs.existsSync(listView)) listView = 'layouts/list';
	if (!fs.existsSync(formView)) formView = 'layouts/form';

	router.get('/', auth('view', mod.dirname), function(req, res){
		mod.Model.find(function(err, items){
			if (req.headers.accept === 'application/json'){
				res.json(items);
			} else{
				res.render(listView, {
					manifest: mod.manifest,
					items: items
				});
			}
		});
	});

	router.get('/new/', auth('create', mod.dirname), function(req, res){
		res.render(formView, {
			action: '/' + mod.manifest.slug + '/new/',
			manifest: mod.manifest
		});
	});

	router.post('/new/', auth('create', mod.dirname), function(req, res){
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

	router.get('/edit/:id/', auth('update', mod.dirname), function(req, res){
		mod.Model.find({_id: req.params.id}, function(err, docs){
			if (err){
				console.error(err);
				return res.redirect('/' + mod.manifest.slug + '/');
			}

			if (!docs.length){
				console.error('No document found with id %s', req.params.id);
				return res.redirect('/' + mod.manifest.slug + '/new/');
			}

			res.render(formView, {
				action: '/' + mod.manifest.slug + '/edit/' + req.params.id + '/',
				manifest: mod.manifest,
				formData: docs[0]
			});
		});
	});

	router.post('/edit/:id/', auth('update', mod.dirname), function(req, res){
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

	router.get('/delete/:id/', auth('delete', mod.dirname), function(req, res){
		mod.Model.remove({_id: req.params.id}, function(err){
			if (err){
				console.error(err);
			}
			res.redirect('/' + mod.manifest.slug + '/');
		});
	});

	return router;
};

/**
 * Available router middleware
 */
generateRouter.middleware = {
	auth: auth
};

module.exports = generateRouter;
