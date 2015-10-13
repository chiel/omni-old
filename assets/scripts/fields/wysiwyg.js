'use strict';

var Scribe = require('scribe-editor');

/**
 * WysiwygEditor
 *
 * @param {Object} spec
 * @param {String} spec.name - Name of the field
 * @param {String} spec.label - The label for the field
 * @param {Boolean} spec.expand - Whether you want the field to expand when a user types in it
 * @param {String} value
 */
var WysiwygEditor = function(spec, value) {
	this.spec = spec;
	this.value = value;
	this.build();
};

/**
 * Build the field
 */
WysiwygEditor.prototype.build = function() {
	if (this.wrap) return;

	var wrap = document.createElement('div');
	wrap.classList.add('informal__field');

	var label = document.createElement('label');
	label.classList.add('informal__label');
	label.textContent = this.spec.label;
	wrap.appendChild(label);

	var inputWrap = document.createElement('div');
	inputWrap.classList.add('informal__input');
	wrap.appendChild(inputWrap);

	var editor = document.createElement('div');
	editor.classList.add('informal__input-wysiwyg');

	if (this.spec.expand) {
		editor.classList.add('informal__input-wysiwyg_expandable');
	}

	var scribe = new Scribe(editor);
	if (this.value) {
		scribe.setHTML(this.value);
	}

	inputWrap.appendChild(editor);

	this.inputWrap = inputWrap;
	this.scribe = scribe;
	this.wrap = wrap;
};

/**
 *
 */
WysiwygEditor.prototype.getValue = function() {
	return this.scribe.getHTML();
};
module.exports = WysiwygEditor;
