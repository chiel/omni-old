'use strict';

var bases = require('../../lib/bases');
var bcrypt = require('bcrypt');
var config = require('../../core/config');
var mail = require('../../lib/mail');
var Promise = require('promise');

/**
 *
 */
module.exports = function(mod, generateMethods){
	var methods = generateMethods(mod);

	methods.create.hooks = {
		pre: function(data, next){
			var password = bases.base62.generateToken(8);
			bcrypt.hash(password, 10, function(err, hash){
				if (err){
					console.error(err);
					return next(new Error(err.message));
				}

				var mailData = {
					from: config.mail.from,
					to: data.email,
					subject: 'Your account has been created',
					text: 'You can log in at ' + config.url + '/login with:' + "\n\n" +
						'Email: ' + data.email + "\n" +
						'Password: ' + password
				};

				mail.send(mailData).then(
					function(body){
						data.password = hash;
						next();
					},
					function(err){
						next(err);
					}
				);
			});
		}
	};

	return methods;
};
