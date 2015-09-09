'use strict';

var Builder = require('builder');
var blocks = require('builder/blocks');
var templates = require('builder/templates');

/**
 * BuilderField
 *
 * @param {Object} spec
 *
 * @return {BuilderField}
 */
var BuilderField = function(spec){
	if (!(this instanceof BuilderField)){
		return new BuilderField(spec);
	}

	this.spec = spec;
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

	this.builder = builder;
	this.wrap = wrap;
};

/**
 *
 */
BuilderField.prototype.notify = function(name, value){
	this.builder.setTemplate(value);
};

module.exports = BuilderField;
