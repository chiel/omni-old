'use strict';

var informal = require('informal');

/**
 * BaseBlock
 */
var BaseBlock = function(wrap){
	if (!(this instanceof BaseBlock)){
		return new BaseBlock(wrap);
	}

	this.wrap = wrap;
	this._build();
};

/**
 * BaseBlock metadata
 */
BaseBlock.prototype.meta = BaseBlock.meta = {
	type: 'content',
	name: 'Content',
	description: 'Standard content',
	constrain: /.*\.main/
};

/**
 * Build block details
 */
BaseBlock.prototype._build = function(){
	if (!this.formSpec) return;

	var form = informal(this.formSpec);
	this.wrap.appendChild(form.wrap);
};

module.exports = BaseBlock;
