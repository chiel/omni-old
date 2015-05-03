'use strict';

var AuthorizationError = require('../../lib/error/authorization');
var config = require('../config');
var jwt = require('jsonwebtoken');

module.exports = [
	function(req, res, next){
		if (!req.headers || !req.headers.authorization){
			return next(new AuthorizationError('no_header', 'No authorization header found'));
		}

		var token = req.headers.authorization.match(/^Bearer (.+)$/);
		if (!token){
			return next(new AuthorizationError('not_bearer', 'Authorization header format needs to be `Bearer [token]`'));
		}

		token = token[1];

		var secret = config.api.secret + config.api.token.secret;
		jwt.verify(token, secret, function(err, payload){
			if (err){
				return next(err);
			}

			req.user = payload.sub;
			next();
		});
	},
	function(err, req, res, next){
		res.json({ error: err });
	}
];
