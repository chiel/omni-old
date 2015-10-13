'use strict';

var forOwn = require('mout/object/forOwn');
var merge = require('mout/object/merge');
var validator = require('is-my-json-valid');

var ValidationError = require('../../../lib/errors/validation');

var types = {
	text: { type: 'string' },
	textarea: { type: 'string' },
	email: { type: 'string' },
	password: { type: 'string' },
	number: { type: 'number' },
	date: { type: 'string', format: 'date-time' },
	time: { type: 'string' },
	boolean: { type: 'boolean' },
	single_option: { type: 'string' },
	multi_option: { type: 'array', items: { type: 'string' }},
	api_multi_option: { type: 'array', items: { type: 'string' }},
	form_list: { type: 'array' },
	list: { type: 'array' },
	markdown: { type: 'string' },
	finder: { type: 'string' },
	slug: { type: 'string' },
	builder: { type: 'object' }
};

/**
 * Generate a json schema for given fields
 *
 * @param {Object} fields
 *
 * @return {Object}
 */
var generateJSONSchema = function(fields) {
	var objectBase = {
		type: 'object',
		additionalProperties: false,
		properties: {}
	};

	var schema = merge({}, objectBase);

	var o, p, def;
	forOwn(fields, function(field, name) {
		name = (field.name || name).replace(/\[/g, '.').replace(/\]/g, '').split('.');
		field.type = field.type || 'text';

		o = schema.properties;

		while (name.length) {
			p = name.shift();
			if (!name.length) break;

			if (!o[p]) {
				o[p] = merge({}, objectBase);
			}
			o = o[p].properties;
		}

		def = merge({}, types[field.type]);

		if (field.required) {
			def.required = true;
		}

		o[p] = def;
	});

	return schema;
};

/**
 * Generate a validator for given schema
 *
 * @param {Object} schema
 */
var generateValidator = function(schema) {
	var validate = validator(schema);

	return function(data) {
		if (validate(data)) return;
		throw new ValidationError(schema, validate.errors);
	};
};

/**
 * Generate a json schema for each form in the manifest
 *
 * @param {Module} mod
 *
 * @return {Object}
 */
var generateValidators = function(mod) {
	if (!mod.manifest.forms) return {};

	var validators = {};
	forOwn(mod.manifest.forms, function(form, formType) {
		validators[formType] = generateValidator(generateJSONSchema(form.fields));
	});

	return validators;
};

module.exports = generateValidators;
