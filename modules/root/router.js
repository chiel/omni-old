'use strict';

var router = require('express').Router();

router.get('/', function(req, res){
	res.render(__dirname + '/views/login');
});

router.post('/login/', function(req, res){
	if (!req.body.email || !req.body.password){
		res.render(__dirname + '/views/login', {
			error: 'Email or password missing'
		});
		return;
	}

	res.status(501).json({});
});

module.exports = router;
