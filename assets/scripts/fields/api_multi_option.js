'use strict';

var MultiOptionField = require('informal/fields/multi_option');
var get = require('mout/object/get');
var map = require('mout/array/map');

/**
 * ApiMultiOption
 *
 * @param {Object} spec
 * @param {String} spec.name - Name of the field
 * @param {String} spec.label - The label for the field
 * @param {Array} spec.options - Options for the multi option field
 * @param {Array} values
 */
var ApiMultiOption = function(spec, values){
	MultiOptionField.call(this, spec, values);

	var self = this;
	fetch(self.spec.endpoint, {
		headers: {
			'Accept': 'application/json'
		},
		credentials: 'include'
	})
	.then(function(res){
		return res.json();
	})
	.then(function(data){
		self.buildOptions(map(data, function(item){
			return {
				value: get(item, self.spec.valueField),
				label: get(item, self.spec.labelField)
			};
		}));
	});
};

require('util').inherits(ApiMultiOption, MultiOptionField);

module.exports = ApiMultiOption;
