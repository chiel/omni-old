'use strict';

var TextareaField = require('informal/fields/textarea');

/**
 * MarkdownField
 *
 * @param {Object} spec
 *
 * @return {MarkdownField}
 */
var MarkdownField = function(spec){
	if (!(this instanceof MarkdownField)){
		return new MarkdownField(spec);
	}

	TextareaField.call(this, spec);
};

require('util').inherits(MarkdownField, TextareaField);

/**
 * Build the field
 */
MarkdownField.prototype.build = function(){
	if (this.wrap) return;

	TextareaField.prototype.build.call(this);

	var topbar = document.createElement('div');
	topbar.classList.add('informal-input-topbar', 'btn-group');

	var actions = [ 'bold', 'italic', 'url' ];
	var btn;

	for (var i = 0; i < actions.length; i++){
		btn = document.createElement('button');
		btn.classList.add('btn', 'btn-primary', 'btn-small');
		btn.type = 'button';
		btn.tabIndex = -1;
		btn.dataset.action = actions[i];
		btn.textContent = actions[i];
		topbar.appendChild(btn);
	}

	var self = this;
	topbar.addEventListener('click', function(e){
		var action = e.target.dataset.action;
		if (!action) return;

		switch (action){
			case 'bold':
				self.wrapSelection('**', '**');
				break;
			case 'italic':
				self.wrapSelection('*', '*');
				break;
			case 'url':
				var url = prompt('Link to where?');
				self.wrapSelection('[', '](' + url + ')');
				break;
		}
	});

	this.wrap.insertBefore(topbar, this.inputWrap);
};

/**
 * Wrap currently selected text in additional characters
 *
 * @param {String} before - Characters to prepend to selection
 * @param {String} after - Characters to append to selection
 */
MarkdownField.prototype.wrapSelection = function(before, after){
	var start = this.input.selectionStart;
	var end = this.input.selectionEnd;
	var value = this.input.value;
	var selected = value.substring(start, end);
	var replace = before + selected + after;
	var caret = (start + replace.length);

	this.input.value = value.substring(0, start) + replace + value.substring(end, value.length);
	this.input.focus();
	this.input.setSelectionRange(start + before.length, start + before.length + selected.length);
};

module.exports = MarkdownField;
