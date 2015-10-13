'use strict';

var AuthorizationError = require('../../../lib/errors/authorization');
var BcryptError = require('../../../lib/errors/bcrypt');
var NotFoundError = require('../../../lib/errors/notfound');
var UnknownError = require('../../../lib/errors/unknown');
var bcrypt = require('bcrypt');
var forOwn = require('mout/object/forOwn');
var mixIn = require('mout/object/mixIn');
var Promise = require('promise');
var modules = require('../../../core/modules');
var validator = require('../../../lib/validator')(require('../schemas/password.json'));

/**
 * Authenticate a user with username and password
 *
 * @param {Object} data - An object containing the user's athentication details
 * @param {String} data.email - User's email
 * @param {String} data.password - User's password
 *
 * @return {Promise}
 */
module.exports = function(data) {
	return new Promise(function(resolve, reject) {
		try {
			validator.validate(data);
		} catch (err){
			return reject(err);
		}

		modules.user.Model.findOne({ email: data.email }).populate('roles').exec(function(err, user) {
			if (err) {
				console.error('UNHANDLED', err);
				return reject(new UnknownError());
			}

			if (!user) {
				return reject(new NotFoundError('Could not find user `' + data.email + '`'));
			}

			bcrypt.compare(data.password, user.password, function(err, equal) {
				if (err) {
					console.error(err);
					return reject(new BcryptError('Failed to do bcrypt compare'));
				}

				if (!equal) {
					return reject(new AuthorizationError('wrong_password', 'Wrong password'));
				}

				user = user.toObject();

				var rights = {};
				user.roles.forEach(function(role) {
					forOwn(role.modules, function(roleRights, moduleName) {
						if (!rights[moduleName]) rights[moduleName] = {};
						mixIn(rights[moduleName], roleRights);
					});
				});

				delete user.roles;
				user.rights = rights;

				resolve(user);
			});
		});
	});
};
