'use strict';

var Scribe = require('scribe-editor');

/**
 * WysiwygEditor
 *
 * @param {Object} spec
 * @param {String} spec.name - Name of the field
 * @param {String} spec.label - The label for the field
 * @param {Boolean} spec.expand - Whether you want the field to expand when a user types in it
 *
 * @return {WysiwygEditor}
 */
var WysiwygEditor = function(spec){
	if (!(this instanceof WysiwygEditor)){
		return new WysiwygEditor(spec);
	}

	this.spec = spec;
	this.build();
};

/**
 * Build the field
 */
WysiwygEditor.prototype.build = function(){
	if (this.wrap) return;

	var wrap = document.createElement('div');
	wrap.classList.add('informal-field');

	var label = document.createElement('label');
	label.textContent = this.spec.label;
	wrap.appendChild(label);

	var inputWrap = document.createElement('div');
	inputWrap.classList.add('informal-input');
	wrap.appendChild(inputWrap);

	var editor = document.createElement('div');
	editor.classList.add('informal-input-wysiwyg');

	if (this.spec.expand){
		editor.classList.add('informal-input-wysiwyg-expand');
	}

	var scribe = new Scribe(editor);

	inputWrap.appendChild(editor);

	this.inputWrap = inputWrap;
	this.scribe = scribe;
	this.wrap = wrap;
};

/**
 *
 */
WysiwygEditor.prototype.getValue = function(){
	return this.scribe.getHTML();
};
module.exports = WysiwygEditor;
