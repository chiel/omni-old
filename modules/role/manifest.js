'use strict';

var cache = require('../../core/cache');
var fs = require('fs');

module.exports = function(manifest){
	var dir = __dirname + '/..';
	var modules = fs.readdirSync(dir);
	var fieldGroup = [];
	var moduleManifest, moduleName, field;

	cache.get('modules').forEach(function(modulePath){
		if (!fs.existsSync(modulePath + '/manifest.json')) return;

		moduleManifest = require(modulePath + '/manifest.json');
		if (!moduleManifest.permissions) return;

		moduleName = modulePath.split('/').pop();
		field = {
			type: 'multi_option',
			style: 'checkbox',
			label: (moduleManifest.name || moduleName) + ' permissions',
			options: []
		};

		moduleManifest.permissions.forEach(function(permission){
			field.options.push({
				value: permission.key,
				label: permission.description
			});
		});

		manifest.forms.create.fields[moduleName] = field;

		fieldGroup.push(moduleName);
		if (fieldGroup.length > 1){
			manifest.forms.create.tabs[0].objects.push(fieldGroup);
			fieldGroup = [];
		}
	});

	if (fieldGroup.length < 2){
		manifest.forms.create.tabs[0].objects.push(fieldGroup);
	}

	return manifest;
};
