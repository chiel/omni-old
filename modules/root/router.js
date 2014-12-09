'use strict';

var auth = require('../auth/lib'),
	forOwn = require('mout/object/forOwn'),
	mixIn = require('mout/object/mixIn');

module.exports = function(){
	var router = require('express').Router();

	router.get('/', function(req, res){
		res.redirect('/dashboard/');
	});

	router.get('/login/', function(req, res){
		res.render(__dirname + '/views/login', {
			forward: req.query.forward
		});
	});

	router.post('/login/', function(req, res){
		if (!req.body.email || !req.body.password){
			res.render(__dirname + '/views/login', {
				error: 'Email or password missing'
			});
			return;
		}

		auth.withPassword(req.body.email, req.body.password, function(err, data){
			if (err){
				return res.render(__dirname + '/views/login', {error: err.message});
			}

			var rights = {};

			data.roles.forEach(function(role){
				forOwn(role.modules, function(roleRights, moduleName){
					if (!rights[moduleName]) rights[moduleName] = {};

					mixIn(rights[moduleName], roleRights);
				});
			});

			data.rights = rights;

			req.session.userData = data;
			res.redirect(req.body.forward || '/');
		});
	});

	router.get('/logout/', function(req, res){
		delete req.session.user;
		delete req.session.userData;
		res.redirect('/');
	});

	return router;
};
