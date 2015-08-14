'use strict';

/**
 * Bcrypt error
 *
 * @param {String} message - Optional error message
 */
var BcryptError = function(message){
	this.name = 'BcryptError';
	this.message = message;
	this.status = 500;
};

require('util').inherits(BcryptError, Error);

/**
 * Generate an object which can be stringified
 */
BcryptError.prototype.toJSON = function(){
	return {
		type: 'bcrypt',
		message: this.message
	};
};

module.exports = BcryptError;
