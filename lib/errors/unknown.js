'use strict';

/**
 * Unknown error
 *
 * @param {String} message
 */
var UnknownError = function(message) {
	this.name = 'UnknownError';
	this.message = message;
	this.status = 500;
};

require('util').inherits(UnknownError, Error);

/**
 * Generate an object which can be stringified
 */
UnknownError.prototype.toJSON = function() {
	var json = { type: 'unknown' };
	if (this.message) {
		json.message = this.message;
	}

	return json;
};

module.exports = UnknownError;
