'use strict';

var MultiOptionField = require('informal/fields/multi_option');
var get = require('mout/object/get');
var map = require('mout/array/map');

/**
 * ApiMultiOption
 *
 * @param {String} name
 * @param {Object} spec
 * @param {String} spec.name - Name of the field if you want to change it
 * @param {String} spec.label - The label for the field
 * @param {Array} spec.options - Options for the multi option field
 *
 * @return {ApiMultiOption}
 */
var ApiMultiOption = function(name, spec){
	if (!(this instanceof ApiMultiOption)){
		return new ApiMultiOption(spec);
	}

	MultiOptionField.call(this, name, spec);

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
