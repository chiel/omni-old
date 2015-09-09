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
	type: 'base',
	name: 'Base'
};

/**
 * Build block details
 */
BaseBlock.prototype._build = function(){
	if (!this.formSpec) return;

	var wrap = document.createElement('div');
	wrap.classList.add('block');

	var heading = document.createElement('h2');
	heading.textContent = this.meta.name;
	wrap.appendChild(heading);

	var form = informal(this.formSpec);
	wrap.appendChild(form.wrap);

	var btn = document.createElement('button');
	btn.classList.add('btn', 'btn-primary', 'block-btn');
	btn.type = 'button';
	btn.textContent = 'Okay';
	wrap.appendChild(btn);

	this.wrap.appendChild(wrap);
};

module.exports = BaseBlock;
