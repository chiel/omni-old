'use strict';

/**
 * Not Found Error with optional message
 *
 * @param {String} message - Optional error message
 */
var NotFoundError = function(message){
	this.name = 'NotFoundError';
	this.message = message;
	this.status = 404;
};

require('util').inherits(NotFoundError, Error);

/**
 * Generate an object which can be stringified
 */
NotFoundError.prototype.toJSON = function(){
	return {
		name: 'not_found',
		message: this.message || 'Could not find stuff'
	};
};

module.exports = NotFoundError;
