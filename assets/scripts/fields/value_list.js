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

	this.items = {};
	this.itemIndex = 0;
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
	this.wrap.innerHTML = '<label>' + (this.spec.label || '') + '</label>' +
		'<fieldset>' +
			'<ul class="value-list--values"></ul>' +
			'<button class="value-list--add">Add</button>' +
		'</fieldset>';

	this.values = this.wrap.querySelector('.value-list--values');
	var addBtn = this.wrap.querySelector('.value-list--add');

	var self = this;
	addBtn.addEventListener('click', function(e){
		e.preventDefault();
		self.addValue();
	});

	this.values.addEventListener('click', function(e){
		if (e.target.classList.contains('btn-remove')){
			e.preventDefault();
			e.target.parentNode.parentNode.removeChild(e.target.parentNode);
		}
	});

	if (this.value && kindOf(this.value) == 'Array' && this.value.length){
		for (var i = 0; i < this.value.length; i++){
			this.addValue(this.value[i]);
		}
	}
};

/**
 * Add a value to the list
 * @param {Object} data
 */
ValueList.prototype.addValue = function(data){
	var li = document.createElement('li'),
		form = new informal.Form(this.spec.form, data),
		removeBtn = document.createElement('button'),
		index = this.itemIndex ++;

	removeBtn.classList.add('btn-remove');
	removeBtn.innerText = 'Remove';

	li.appendChild(form.wrap);
	li.appendChild(removeBtn);
	li.setAttribute('data-index', index);
	this.values.appendChild(li);
	this.items[index] = form;
};

/**
 * Get all values
 */
ValueList.prototype.getValue = function(){
	var values = [], i, index;
	for (i = 0; i < this.values.childNodes.length; i++){
		index = this.values.childNodes[i].getAttribute('data-index');
		values.push(this.items[index].getValues());
	}
	return values;
};

/**
 * Clear values
 */
ValueList.prototype.clear = function(){
	this.items = {};
	while (this.values.firstChild){
		this.values.removeChild(this.values.firstChild);
	}
};

module.exports = ValueList;
