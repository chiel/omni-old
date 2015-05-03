'use strict';

var config = require('../../core/config');
var jwt = require('jsonwebtoken');

module.exports = function(mod){
	var router = require('express').Router();

	router.post('/', function(req, res){
		if (!req.body.key || !req.body.secret){
			return res.status(403).json({
				error: {
					message: 'unable to find key and secret'
				}
			});
		}

		var token = jwt.sign({}, config.api.secret + config.api.token.secret, { subject: config.api.key });
		res.json({ token: token });
	});

	return router;
};
