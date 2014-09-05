'use strict';

var bcrypt = require('bcrypt'),
	AuthError = require('./autherror'),
	modules = require('../../core/modules');

/**
 * Authenticate with email and password
 * @param {String} email
 * @param {String} password
 * @param {Function} cb
 */
var withPassword = function(email, password, cb){
	if (!email || !password){
		cb(new Error('E-mail or password not provided'));
		return;
	}

	modules.user.Model.findOne({email: email}, function(err, doc){
		if (err) return cb(err);

		if (!doc){
			return cb(new AuthError('EUSERNEXIST', 'Could not find user with that email'));
		}

		bcrypt.compare(password, doc.password, function(err, equal){
			if (err){
				return cb(new Error('Failed to do bcrypt compare'));
			}

			if (!equal){
				return cb(new AuthError('EAUTHWRONGPASS', 'Incorrect password'));
			}

			cb(null, doc);
		});
	});
};

module.exports = {
	withPassword: withPassword
};
