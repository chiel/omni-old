'use strict';

var router = require('express').Router(),
	auth = require('../auth/lib');

router.get('/', function(req, res){
	if (req.session.user){
		res.render('dashboard');
	} else {
		res.redirect('/login/');
	}
});

router.get('/login/', function(req, res){
	res.render(__dirname + '/views/login');
});

router.post('/login/', function(req, res){
	if (!req.body.email || !req.body.password){
		res.render(__dirname + '/views/login', {
			error: 'Email or password missing'
		});
		return;
	}

	auth.withPassword(req.body.email, req.body.password, function(err, user){
		if (err){
			return res.render(__dirname + '/views/login', {error: err.message});
		}
		req.session.user = user;
		res.redirect('/');
	});
});

router.get('/logout/', function(req, res){
	delete req.session.user;
	res.redirect('/');
});

module.exports = router;
