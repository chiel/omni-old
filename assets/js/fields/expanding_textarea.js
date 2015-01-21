'use strict';

var Textarea = require('informal').fields.textarea;

var ExpandingTextarea = function(spec, data){
	if (!(this instanceof ExpandingTextarea)) return new ExpandingTextarea(spec, data);
	Textarea.call(this, spec, data);
};

require('inherits')(ExpandingTextarea, Textarea);

ExpandingTextarea.prototype.build = function(){
	Textarea.prototype.build.call(this);

	this.textwrap = document.createElement('div');
	this.textwrap.classList.add('expanding-textarea');
	this.input.parentNode.insertBefore(this.textwrap, this.input.nextSibling);
	this.textwrap.appendChild(this.input);

	var pre = document.createElement('pre'),
		span = document.createElement('span');
	pre.appendChild(span);
	pre.appendChild(document.createElement('br'));
	this.textwrap.appendChild(pre);

	span.textContent = this.input.value;

	var self = this;
	this.input.addEventListener('input', function(){
		span.textContent = self.input.value;
	});
};

module.exports = ExpandingTextarea;
