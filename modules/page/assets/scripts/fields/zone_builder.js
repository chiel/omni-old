'use strict';

var forOwn = require('mout/object/forOwn');
var isObject = require('mout/lang/isObject');
var Base = require('informal').fields.base;
var Builder = require('builder');

/**
 * Zone Builder input
 * @param {Object} spec
 * @param {Object} value
 * @param {Object} subValues
 */
var ZoneBuilder = function(spec, value, subValues){
	if (!(this instanceof ZoneBuilder)) return new ZoneBuilder(spec, value, subValues);
	Base.call(this, spec, value, subValues);
};

require('inherits')(ZoneBuilder, Base);

/**
 * Build Zone Builder elements
 */
ZoneBuilder.prototype.build = function(template){
	if (this.wrap) return;

	this.builder = new Builder();
	this.wrap = this.builder.wrap;
	this.wrap.classList.add('informal--field');

	if (this.subValues.template){
		this.builder.setTemplate(this.subValues.template);
		if (isObject(this.value)){
			var self = this, i;
			forOwn(this.value, function(blocks, zoneName){
				for (i = 0; i < blocks.length; i++){
					self.builder.addBlock(zoneName, blocks[i].type, blocks[i].style, blocks[i].properties);
				}
			});
		}
	}
};

/**
 * Receive notifications from other fields
 */
ZoneBuilder.prototype.notify = function(name, value){
	if (name == 'template'){
		this.builder.setTemplate(value);
	}
};

/**
 * Get this field's value
 * @return {Object}
 */
ZoneBuilder.prototype.getValue = function(){
	return this.builder.getValues();
};

module.exports = ZoneBuilder;
