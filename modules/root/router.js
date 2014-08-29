'use strict';

var router = require('express').Router(),
	auth = require('../auth/lib');

router.get('/', function(req, res){
	res.render('dashboard');
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
		req.session.userData = data;
		res.redirect(req.body.forward || '/');
	});
});

router.get('/logout/', function(req, res){
	delete req.session.user;
	delete req.session.userData;
	res.redirect('/');
});

module.exports = router;
