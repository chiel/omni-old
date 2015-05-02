'use strict';

var Finder = require('finder.js');
var TextField = require('informal').fields.text;

var FinderField = function(spec, value){
	if (!(this instanceof FinderField)) return new FinderField(spec, value);
	TextField.call(this, spec, value);
};

require('inherits')(FinderField, TextField);

FinderField.prototype.build = function(){
	TextField.prototype.build.call(this);

	var btn = document.createElement('button');
	btn.setAttribute('type', 'button');
	btn.classList.add('btn');
	btn.textContent = 'Browse...';
	this.wrap.insertBefore(btn, this.input.nextSibling);
	this.addButton = btn;

	var overlay = document.createElement('div');
	overlay.classList.add('finder-overlay');
	document.body.appendChild(overlay);
	this.overlay = overlay;

	var content = document.createElement('div');
	content.classList.add('finder-content');
	document.body.appendChild(content);
	this.content = content;

	this.finder = new Finder(this.spec.options);
};

FinderField.prototype.setEvents = function(){
	TextField.prototype.setEvents.call(this);

	var self = this;
	this.addButton.addEventListener('click', function(e){
		e.preventDefault();
		self.open();
	});

	this.finder.on('file.selected', function(path){
		self.input.value = path;
		self.close();
	});
};

FinderField.prototype.open = function(){
	this.overlay.classList.add('is-shown');
	this.content.classList.add('is-shown');
	this.finder.open(this.content, this.input.value);
};

FinderField.prototype.close = function(){
	this.overlay.classList.remove('is-shown');
	this.content.classList.remove('is-shown');
};

module.exports = FinderField;
