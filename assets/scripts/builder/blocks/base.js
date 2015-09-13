'use strict';

var informal = require('informal');

/**
 * BaseBlock
 */
var BaseBlock = function(data, wrap, callback){
	if (!(this instanceof BaseBlock)){
		return new BaseBlock(wrap, callback);
	}

	this.data = data;
	this.wrap = wrap;
	this.callback = callback;
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

	var wrap = document.createElement('form');
	wrap.classList.add('block');

	var heading = document.createElement('h2');
	heading.textContent = this.meta.name;
	wrap.appendChild(heading);

	var form = informal(this.formSpec, this.data);
	wrap.appendChild(form.wrap);

	var btn = document.createElement('button');
	btn.classList.add('btn', 'btn-primary', 'block-btn');
	btn.type = 'submit';
	btn.textContent = 'Okay';
	wrap.appendChild(btn);

	this.wrap.appendChild(wrap);

	this.form = form;
	this._setEvents();
};

/**
 * Set block events
 */
BaseBlock.prototype._setEvents = function(){
	var self = this;

	self.wrap.addEventListener('submit', function(e){
		e.preventDefault();
		self.callback(self.form.getValues());
	});
};

module.exports = BaseBlock;
