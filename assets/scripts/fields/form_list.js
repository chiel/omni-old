'use strict';

var informal = require('informal');
var map = require('mout/array/map');
var Sortable = require('sortable.js');

/**
 * FormListField
 *
 * @param {Object} spec
 * @param {Array} value
 */
var FormListField = function(spec, value){
	this.spec = spec;
	this.value = value;
	this.forms = {};
	this.itemIndex = 0;

	this.build();
};

/**
 * Build specific elements
 */
FormListField.prototype.build = function(){
	if (this.wrap) return;

	var wrap = document.createElement('div');
	wrap.classList.add('informal-field', 'informal-field-list');

	var label = document.createElement('label');
	label.textContent = this.spec.label;
	wrap.appendChild(label);

	var addBtn = document.createElement('button');
	addBtn.type = 'button';
	addBtn.tabIndex = -1;
	addBtn.textContent = 'add item';
	label.appendChild(addBtn);
	this.addBtn = addBtn;

	var items = document.createElement('ul');
	items.classList.add('informal-field-list-items');
	wrap.appendChild(items);
	this.items = items;

	if (this.value){
		for (var i = 0; i < this.value.length; i++){
			this.addItem(this.value[i]);
		}
	}

	this.wrap = wrap;
	this.setEvents();
};

/**
 * Set events
 */
FormListField.prototype.setEvents = function(){
	this.sortable = new Sortable(this.items, {
		handle: '.informal-field-list-drag-handle'
	});

	var self = this;
	this.addBtn.addEventListener('click', function(e){
		e.preventDefault();
		self.addItem();
	});

	this.items.addEventListener('click', function(e){
		if (e.target.classList.contains('act-remove')){
			e.preventDefault();
			self.items.removeChild(e.target.parentNode);
		}
	});
};

/**
 * Add a value to the list
 * @param {Object} data
 */
FormListField.prototype.addItem = function(data){
	var index = this.itemIndex++;

	var li = document.createElement('li');
	var dragHandle = document.createElement('span');
	dragHandle.classList.add('informal-field-list-drag-handle');

	var removeBtn = document.createElement('button');
	removeBtn.type = 'button';
	removeBtn.classList.add('act-remove');
	removeBtn.innerText = 'Remove';

	var form = informal(this.spec.form, data);

	li.appendChild(dragHandle);
	li.appendChild(form.wrap);
	li.appendChild(removeBtn);
	li.setAttribute('data-index', index);
	li.setAttribute('draggable', true);
	this.items.appendChild(li);
	this.forms[index] = form;
};

/**
 * Get all values
 */
FormListField.prototype.getValue = function(){
	var self = this;

	return map(this.items.children, function(el){
		return self.forms[el.dataset.index].getValues();
	});
};

module.exports = FormListField;
