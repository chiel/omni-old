'use strict';

var cache = require('../../core/cache');
var fs = require('fs');

module.exports = function(manifest){
	var dir = __dirname + '/..';
	var modules = fs.readdirSync(dir);
	var moduleManifest;
	var moduleName;
	var field;

	cache.get('modules').forEach(function(modulePath){
		if (!fs.existsSync(modulePath + '/manifest.json')) return;

		moduleManifest = require(modulePath + '/manifest.json');
		if (!moduleManifest.permissions) return;

		moduleName = modulePath.split('/').pop();
		field = {
			type: 'multi_option',
			label: (moduleManifest.name || moduleName) + ' permissions',
			options: []
		};

		moduleManifest.permissions.forEach(function(permission){
			field.options.push({
				value: permission.key,
				label: permission.description
			});
		});

		manifest.form.fields[moduleName] = field;
		manifest.form.tabs[0].objects.push(moduleName);
	});

	return manifest;
};
