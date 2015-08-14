'use strict';

/**
 * Authorization error
 *
 * @param {String} type - Error type
 * @param {String} message - Error message
 */
var AuthorizationError = function(type, message){
	this.name = 'AuthorizationError';
	this.type = type;
	this.message = message;
	this.status = 403;
};

require('util').inherits(AuthorizationError, Error);

/**
 * Generate an object which can be stringified
 */
AuthorizationError.prototype.toJSON = function(){
	var json = {
		name: 'authorization',
		message: this.message
	};

	if (this.type) json.type = this.type;
	return json;
};

module.exports = AuthorizationError;
