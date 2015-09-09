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

	if (options.length > 1){
		options.unshift({
			value: '',
			label: '...'
		});
	} else{
		var tabObjects = manifest.form.tabs[0].objects;
		tabObjects.splice(tabObjects.indexOf('template'), 1);
		manifest.form.fields.template.value = options[0].value;
	}

	manifest.form.fields.template.options = options;
	return manifest;
};
