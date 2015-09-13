'use strict';

/**
 * Duplicate error
 *
 * @param {String} field - Field name which has a duplicate entry
 */
var DuplicateError = function(field){
	this.name = 'DuplicateError';
	this.field = field || '';
	this.status = 403;
};

require('util').inherits(DuplicateError, Error);

/**
 * Generate an object which can be stringified
 */
DuplicateError.prototype.toJSON = function(){
	return {
		name: 'duplicate',
		message: 'Duplicate entry for field `' + this.field + '`',
		field: this.field
	};
};

module.exports = DuplicateError;
