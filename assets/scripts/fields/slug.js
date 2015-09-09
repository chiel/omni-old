'use strict';

var TextField = require('informal/fields/text');
var slugify = require('mout/string/slugify');

/**
 * SlugField
 *
 * @param {Object} spec
 *
 * @return {SlugField}
 */
var SlugField = function(spec){
	if (!(this instanceof SlugField)){
		return new SlugField(spec);
	}

	TextField.call(this, spec);
	this.subValues = {};
};

require('util').inherits(SlugField, TextField);

/**
 *
 */
SlugField.prototype.notify = function(name, value){
	this.subValues[name] = value;

	var values = [];
	var sub;
	for (var i = 0; i < this.spec.subscribe.length; i++){
		sub = this.spec.subscribe[i];
		if (this.subValues[sub]){
			values.push(this.subValues[sub]);
		}
	}

	this.input.value = slugify(values.join(' ')).replace(/-+/g, '-');
};

module.exports = SlugField;
