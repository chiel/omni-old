'use strict';

var SingleOptionField = require('informal/fields/single_option');
var get = require('mout/object/get');
var map = require('mout/array/map');

/**
 * ApiSingleOptionField
 *
 * @param {Object} spec
 * @param {String} spec.name - Name of the field
 * @param {String} spec.label - The label for the field
 * @param {Array} spec.options - Options for the single option field
 * @param {Array} values
 */
var ApiSingleOptionField = function(spec, values) {
	SingleOptionField.call(this, spec, values);

	var self = this;
	fetch(self.spec.endpoint, {
		headers: {
			'Accept': 'application/json'
		},
		credentials: 'include'
	})
	.then(function(res) {
		return res.json();
	})
	.then(function(data) {
		self.buildOptions(map(data, function(item) {
			return {
				value: get(item, self.spec.valueField),
				label: get(item, self.spec.labelField)
			};
		}));
	});
};

require('util').inherits(ApiSingleOptionField, SingleOptionField);

module.exports = ApiSingleOptionField;
