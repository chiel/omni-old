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

	/**
	 * Item list view
	 */
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

	/**
	 * New item form view
	 */
	router.get('/new/', auth('create', mod.dirname), function(req, res){
		res.render(formView, {
			action: '/' + mod.manifest.slug + '/new/',
			manifest: mod.manifest,
			formType: 'create'
		});
	});

	/**
	 * New item creation
	 */
	router.post('/new/', auth('create', mod.dirname), function(req, res){
		mod.methods.create(req.body).then(
			function(item){
				res
					.location('/' + mod.manifest.slug + '/edit/' + item._id + '/')
					.status(201)
					.json(item);
			},
			function(err){
				res
					.status(err.status || 500)
					.json({ error: err });
			}
		);
	});

	/**
	 * Existing item form view
	 */
	router.get('/edit/:id/', auth('update', mod.dirname), function(req, res){
		mod.methods.findOne({ _id: req.params.id }).then(
			function(item){
				res.render(formView, {
					action: '/' + mod.manifest.slug + '/edit/' + item._id + '/',
					manifest: mod.manifest,
					formType: mod.manifest.forms.update ? 'update' : 'create',
					formData: item
				});
			},
			function(err){
				res.send('An error occurred: ' + err.message);
			}
		);
	});

	/**
	 * Existing item updating
	 */
	router.post('/edit/:id/', auth('update', mod.dirname), function(req, res){
		mod.methods.update(req.params.id, req.body).then(
			function(item){
				res.json(item);
			},
			function(err){
				res.status(err.status).json({ error: err });
			}
		);
	});

	/**
	 * Delete item
	 */
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
