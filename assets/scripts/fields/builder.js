'use strict';

var Builder = require('builder');
var blocks = require('builder/blocks');
var templates = require('builder/templates');

/**
 * BuilderField
 *
 * @param {Object} spec
 * @param {Object} data
 * @param {Object} subscriptionValues
 *
 * @return {BuilderField}
 */
var BuilderField = function(spec, data, subscriptionValues){
	if (!(this instanceof BuilderField)){
		return new BuilderField(spec, data, subscriptionValues);
	}

	this.spec = spec;
	this.data = data;
	this.subscriptionValues = subscriptionValues;
	this.build();
};

/**
 * Build the field
 */
BuilderField.prototype.build = function(){
	if (this.wrap) return;

	var wrap = document.createElement('div');
	wrap.classList.add('informal-field');

	var label = document.createElement('label');
	label.textContent = this.spec.label;
	wrap.appendChild(label);

	var builder = new Builder({
		blocks: blocks,
		templates: templates
	});
	wrap.appendChild(builder.wrap);

	if (this.subscriptionValues.template){
		builder.setTemplate(this.subscriptionValues.template);
	}

	this.builder = builder;
	this.wrap = wrap;
};

/**
 *
 */
BuilderField.prototype.notify = function(name, value){
	this.builder.setTemplate(value);
};

/**
 * Get current value of the builder
 *
 * @return {Object}
 */
BuilderField.prototype.getValue = function(){
	return this.builder.getValue();
};

module.exports = BuilderField;
