'use strict';

/**
 * Unknown error
 */
var UnknownError = function(){
	this.name = 'UnknownError';
	this.status = 500;
};

require('util').inherits(UnknownError, Error);

/**
 * Generate an object which can be stringified
 */
UnknownError.prototype.toJSON = function(){
	return {
		name: 'unknown',
		message: 'An unknown error occured. We\'ve dispatched a batch of crafty monkeys to deal with the situation.'
	};
};

module.exports = UnknownError;
