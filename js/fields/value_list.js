'use strict';

var informal = require('informal'),
	Base = informal.fields.base,
	kindOf = require('mout/lang/kindOf');

/**
 * Value List input
 * @param {Object} form
 * @param {String} name
 * @param {String} value
 */
var ValueList = function(form, name, value){
	if (!(this instanceof ValueList)){
		return new ValueList(form, name, value);
	}

	this.items = [];
	Base.call(this, form, name, value);
};

require('inherits')(ValueList, Base);

/**
 * Build specific elements
 */
ValueList.prototype.build = function(){
	if (this.wrap) return;

	this.wrap = document.createElement('div');
	this.wrap.classList.add('informal--field');
	this.wrap.innerHTML = '<label>' + this.spec.label + '</label>' +
		'<fieldset>' +
			'<ul class="value-list--values"></ul>' +
			'<div class="value-list--new"></div>' +
		'</fieldset>';

	this.values = this.wrap.querySelector('.value-list--values');
	var newDiv = this.wrap.querySelector('.value-list--new');

	this.form = new informal.Form(this.spec.form);
	newDiv.appendChild(this.form.wrap);

	var btn = document.createElement('button');
	btn.innerText = 'Add';
	newDiv.appendChild(btn);

	var self = this;
	btn.addEventListener('click', function(e){
		e.preventDefault();
		self.addValue(self.form.getValues());
		self.form.clear();
	});

	if (this.value && kindOf(this.value) == 'Array' && this.value.length){
		for (var i = 0; i < this.value.length; i++){
			this.addValue(this.value[i]);
		}
	}
};

/**
 * Add a value to the list
 */
ValueList.prototype.addValue = function(data){
	var li = document.createElement('li'),
		form = new informal.Form(this.spec.form, data);
	li.appendChild(form.wrap);
	this.values.appendChild(li);
	this.items.push(form);
};

/**
 * Get all values
 */
ValueList.prototype.getValue = function(){
	var values = [], i;
	for (i = 0; i < this.items.length; i++){
		values.push(this.items[i].getValues());
	}
	return values;
};

/**
 * Clear values
 */
ValueList.prototype.clear = function(){
	this.items = [];
	while (this.values.firstChild){
		this.values.removeChild(this.values.firstChild);
	}
	this.form.clear();
};

module.exports = ValueList;
