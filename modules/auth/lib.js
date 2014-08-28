'use strict';

var client = require('mongodb').MongoClient,
	bcrypt = require('bcrypt'),
	AuthError = require('./autherror'),
	config = require('../../core/config');

/**
 * Authenticate with email and password
 * @param {String} email
 * @param {String} password
 * @param {Function} fn
 */
var withPassword = function(email, password, fn){
	if (!email || !password){
		fn(new Error('E-mail or password not provided'));
		return;
	}

	client.connect(config.mongo, function(err, db){
		if (err){
			return fn(new Error('Failed to connect to MongoDB'));
		}

		var collection = db.collection('user');
		collection.findOne({email: email}, function(err, doc){
			db.close();
			if (err){
				return fn(new Error('Failed to query collection'));
			}

			if (!doc){
				return fn(new AuthError('EUSERNOEXIST', 'Could not find user with that email'));
			}

			bcrypt.compare(password, doc.password, function(err, equal){
				if (err){
					return fn(new Error('Failed to do bcrypt compare'));
				}

				if (!equal){
					return fn(new AuthError('EAUTHWRONGPASS', 'Incorrect password'));
				}

				fn(null, doc);
			});
		});
	});
};

module.exports = {
	withPassword: withPassword
};
