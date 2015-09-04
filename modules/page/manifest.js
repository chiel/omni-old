'use strict';

var templates = require('../../gulp/tmp/templates');

module.exports = function(manifest){
	var options = templates.map(function(template){
		return {
			value: template.type,
			label: template.name
		};
	}).sort(function(a, b){
		return a.label > b.label ? 1 : a.label < b.label ? -1 : 0;
	});

	options.unshift({
		value: '',
		label: '...'
	});

	manifest.form.fields.template.options = options;
	return manifest;
};
