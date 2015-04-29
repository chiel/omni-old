'use strict';

var informal = require('informal');
var Base = informal.fields.base;
var indexOf = require('mout/array/indexOf');
var kindOf = require('mout/lang/kindOf');

/**
 * List input
 * @param {Object} form
 * @param {String} name
 * @param {String} value
 */
var List = function(form, name, value){
	if (!(this instanceof List)){
		return new List(form, name, value);
	}

	this.items = {};
	this.itemIndex = 0;
	Base.call(this, form, name, value);
};

require('inherits')(List, Base);

/**
 * Build specific elements
 */
List.prototype.build = function(){
	if (this.wrap) return;

	this.wrap = document.createElement('div');
	this.wrap.classList.add('informal--field');
	this.wrap.classList.add('field-type--list');
	this.wrap.innerHTML = '<label>' + (this.spec.label || '') + '</label>' +
		'<fieldset>' +
			'<ul class="value-list--values"></ul>' +
			'<button class="value-list--add">Add</button>' +
		'</fieldset>';

	this.values = this.wrap.querySelector('.value-list--values');
	this.addBtn = this.wrap.querySelector('.value-list--add');

	this.placeholder = document.createElement('li');
	this.placeholder.classList.add('list--placeholder');

	if (this.value && kindOf(this.value) == 'Array' && this.value.length){
		for (var i = 0; i < this.value.length; i++){
			this.addItem(this.value[i]);
		}
	}
};

List.prototype.setEvents = function(){
	var self = this, isDrag;
	this.addBtn.addEventListener('click', function(e){
		e.preventDefault();
		self.addItem();
	});

	this.values.addEventListener('click', function(e){
		if (e.target.classList.contains('btn-remove')){
			e.preventDefault();
			e.target.parentNode.parentNode.removeChild(e.target.parentNode);
		}
	});

	this.values.addEventListener('mousedown', function(e){
		var target = e.target || e.srcElement;
		if (target.classList.contains('drag-handle')){
			isDrag = true;
		}
	});

	this.values.addEventListener('dragover', function(e){
		e.preventDefault(); // required for anything to be droppable at all
	});

	this.values.addEventListener('dragstart', function(e){
		if (!isDrag){
			e.preventDefault();
			return;
		}

		e.stopPropagation();
		self.dragging = true;

		var target = e.target || e.srcElement;
		e.dataTransfer.setData('text', ''); // needed for drag to work in FF
		isDrag = false;
		self.dragBlock = target;

		// this delay is needed cause the dragImage won't be created properly otherwise
		setTimeout(function(){
			var rect = self.dragBlock.getBoundingClientRect();
			self.placeholder.style.height = (rect.bottom - rect.top) + 'px';
			self.dragBlock.parentNode.insertBefore(self.placeholder, self.dragBlock);
			self.dragBlock.style.display = 'none';
		}, 1);
	});

	this.values.addEventListener('dragenter', function(e){
		if (!self.dragging) return;
		e.stopPropagation();

		var target = e.target || e.srcElement,
			li = self.getItem(target);

		if (li){
			var placeholderIndex = indexOf(self.values.childNodes, self.placeholder),
				liIndex = indexOf(self.values.childNodes, li);

			if (placeholderIndex == -1 || placeholderIndex > liIndex){
				self.values.insertBefore(self.placeholder, li);
			} else {
				self.values.appendChild(self.placeholder);
			}
		}
	});

	document.body.addEventListener('dragend', function(e){
		if (!self.dragging) return;
		e.stopPropagation();

		self.dragging = false;
		self.placeholder.parentNode.insertBefore(self.dragBlock, self.placeholder);
		self.dragBlock.style.display = 'block';
		self.placeholder.parentNode.removeChild(self.placeholder);
		self.placeholder.style.height = '';
	});
};

/**
 *
 */
List.prototype.getItem = function(el){

	var children = this.values.childNodes, index;
	while (el.parentNode){
		if (el == this.values) return;
		index = indexOf(children, el);
		if (index != -1 && el != this.placeholder){
			break;
		}
		el = el.parentNode;
	}

	return el;
};

/**
 * Add a value to the list
 * @param {Object} data
 */
List.prototype.addItem = function(data){
	var li = document.createElement('li');
	var dragHandle = document.createElement('span');
	var form = new informal.Form(this.spec.form, data);
	var removeBtn = document.createElement('button');
	var index = this.itemIndex ++;

	dragHandle.classList.add('drag-handle');
	removeBtn.classList.add('btn-remove');
	removeBtn.innerText = 'Remove';

	li.appendChild(dragHandle);
	li.appendChild(form.wrap);
	li.appendChild(removeBtn);
	li.setAttribute('data-index', index);
	li.setAttribute('draggable', true);
	this.values.appendChild(li);
	this.items[index] = form;
};

/**
 * Get all values
 */
List.prototype.getValue = function(){
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
List.prototype.clear = function(){
	this.items = {};
	while (this.values.firstChild){
		this.values.removeChild(this.values.firstChild);
	}
};

module.exports = List;
