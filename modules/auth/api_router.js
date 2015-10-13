'use strict';

var config = require('../../core/config');
var jwt = require('jsonwebtoken');

module.exports = function(mod) {
	var router = require('express').Router();

	router.post('/', function(req, res) {
		if (!req.body.key || !req.body.secret) {
			return res.status(403).json({
				error: {
					message: 'unable to find key and secret'
				}
			});
		}

		var keyValid = config.api.key === req.body.key;
		var secretValid = config.api.secret === req.body.secret;
		if (!keyValid || !secretValid) {
			return res.status(401).json({
				error: {
					message: 'Key/secret combination invalid'
				}
			});
		}

		var token = jwt.sign({}, config.api.secret + config.api.token.secret, { subject: config.api.key });
		res.json({ token: token });
	});

	return router;
};
