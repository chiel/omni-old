'use strict';

var authWithPassword = require('./methods/password');
var forOwn = require('mout/object/forOwn');
var mixIn = require('mout/object/mixIn');

module.exports = function(mod) {
	var router = require('express').Router();

	router.get('/', function(req, res) {
		res.redirect('/dashboard/');
	});

	router.get('/login/', function(req, res) {
		res.render('$auth/login', {
			forward: req.query.forward,
			manifest: mod.manifest
		});
	});

	router.post('/login/', function(req, res) {
		authWithPassword(req.body).then(
			function(user) {
				req.session.userData = user;
				res
					.location('/dashboard/')
					.json({ user: user });
			},
			function(err) {
				res.status(err.status || 500).json({ error: err });
			}
		);
	});

	router.get('/logout/', function(req, res) {
		delete req.session.user;
		delete req.session.userData;
		res.redirect('/');
	});

	return router;
};
