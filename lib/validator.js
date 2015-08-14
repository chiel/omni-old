'use strict';

var ValidationError = require('./errors/validation');
var validator = require('is-my-json-valid');

/**
 * Small validation abstraction
 *
 * @param {Object} schema - The schema to validate
 */
module.exports = function(schema){
	var validate = validator(schema);

	return {
		validate: function(data){
			if (validate(data)) return;
			throw new ValidationError(schema, validate.errors);
		}
	};
};
