'use strict';

var Builder = require('builder');
var blocks = require('builder/blocks');
var forOwn = require('mout/object/forOwn');
var templates = require('builder/templates');

/**
 * BuilderField
 *
 * @param {Object} spec
 * @param {Object} value
 * @param {Object} subscriptionValues
 */
var BuilderField = function(spec, value, subscriptionValues){
	this.spec = spec;
	this.value = value;
	this.subscriptionValues = subscriptionValues;
	this.build();
};

/**
 * Build the field
 */
BuilderField.prototype.build = function(){
	if (this.wrap) return;

	var wrap = document.createElement('div');
	wrap.classList.add('informal__field');

	var label = document.createElement('label');
	label.classList.add('informal__label');
	label.textContent = this.spec.label;
	wrap.appendChild(label);

	var builder = new Builder({
		blocks: blocks,
		templates: templates
	});
	wrap.appendChild(builder.wrap);

	if (this.subscriptionValues.template){
		builder.setTemplate(this.subscriptionValues.template);

		if (this.value){
			var i;
			forOwn(this.value, function(blocks, zoneName){
				for (i = 0; i < blocks.length; i++){
					builder.addBlock(zoneName, blocks[i].type, blocks[i].data);
				}
			});
		}
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
