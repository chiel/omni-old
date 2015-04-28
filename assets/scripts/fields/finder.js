'use strict';

var Finder = require('finder.js');
var Text = require('informal').fields.text;

var FinderField = function(spec, value){
	if (!(this instanceof FinderField)) return new FinderField(spec, value);
	Text.call(this, spec, value);
};

require('inherits')(FinderField, Text);

FinderField.prototype.build = function(){
	Text.prototype.build.call(this);

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
	Text.prototype.setEvents.call(this);

	var self = this;
	this.addButton.addEventListener('click', function(e){
		e.preventDefault();
		self.open();
	});
};

FinderField.prototype.open = function(){
	this.overlay.classList.add('is-shown');
	this.content.classList.add('is-shown');
	this.finder.attach(this.content);
};

module.exports = FinderField;
