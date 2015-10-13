'use strict';

/**
 * Validation error
 *
 * @param {Object} schema - The schema against which was validated
 * @param {Array} errors - Errors output by is-my-json-valid's validate
 */
var ValidationError = function(schema, errors) {
	this.name = 'ValidationError';
	this.status = 403;

	var fields = {};
	var type = 'validation';
	var err, fieldName, fieldSchema, fieldType, fieldHint, message;

	for (var i = 0; i < errors.length; i++) {
		err = errors[i];
		fieldName = err.field.match(/data\.(.*)/);

		if (!fieldName) {
			if (/additional properties/.test(err.message)) {
				type = 'additional_properties';
				message = 'Additional properties that are not accepted were specified';
				fields = {};
				break;
			}

			if (/wrong type/.test(err.message)) {
				type = 'invalid_type';
				message = 'The root element is the wrong type';
				fields = {};
				break;
			}
			continue;
		}

		message = 'Some fields had errors';
		fieldName = fieldName[1];
		fieldSchema = schema.properties[fieldName];
		fieldType = 'unknown';

		if (/required/.test(err.message)) {
			fieldType = 'required';
		} else if (/additional properties/.test(err.message)) {
			fieldType = 'invalid_properties';
		} else if (/wrong type/.test(err.message)) {
			fieldType = 'invalid_type';
		} else if (/pattern/.test(err.message)) {
			fieldType = 'format';
			fieldHint = 'Should match ' + fieldSchema.pattern;
		} else if (/less length/.test(err.message)) {
			fieldType = 'too_short';
			fieldHint = 'Minimum length is ' + fieldSchema.minLength;
		} else if (/longer length/.test(err.message)) {
			fieldType = 'too_long';
			fieldHint = 'Maximum length is ' + fieldSchema.maxLength;
		}

		fields[fieldName] = {
			type: fieldType
		};

		if (fieldHint) {
			fields[fieldName].hint = fieldHint;
		}
	}

	if (!Object.keys(fields).length) {
		fields = undefined;
	}

	this.message = message;
	this.fields = fields;
	this.type = type;
};

require('util').inherits(ValidationError, Error);

/**
 * Generate an object which can be stringified
 */
ValidationError.prototype.toJSON = function() {
	var json = {
		type: this.type,
		message: this.message
	};

	if (this.fields) {
		json.fields = this.fields;
	}

	return json;
};

module.exports = ValidationError;
