'use strict';

var Darkbox = require('darkbox');
var Finder = require('finder.js');
var TextField = require('informal/fields/text');

/**
 * FinderField
 *
 * @param {Object} spec
 * @param {String} value
 */
var FinderField = function(spec, value){
	TextField.call(this, spec, value);
};

require('util').inherits(FinderField, TextField);

/**
 *
 */
FinderField.prototype.build = function(){
	TextField.prototype.build.call(this);

	var btn = document.createElement('button');
	btn.type = 'button';
	btn.textContent = 'Browse';
	btn.classList.add('btn', 'btn-primary', 'informal__input-suffix');
	this.inputWrap.appendChild(btn);

	this.darkbox = new Darkbox();
	this.finder = new Finder(this.spec.options);

	var self = this;
	btn.addEventListener('click', function(e){
		e.preventDefault();
		self.open();
	});
};

/**
 *
 */
FinderField.prototype.open = function(){
	var self = this;
	this.darkbox.open('finder', {
		finder: this.finder,
		path: this.getValue(),
		callback: function(path){
			self.input.value = path;
		}
	});
};

module.exports = FinderField;
