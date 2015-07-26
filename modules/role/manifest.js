'use strict';

var cache = require('../../core/cache');
var fs = require('fs');

module.exports = function(manifest){
	var dir = __dirname + '/..';
	var modules = fs.readdirSync(dir);
	var moduleName, moduleManifest, fields;

	cache.get('modules').forEach(function(modulePath){
		moduleName = modulePath.split('/').pop();

		try{
			moduleManifest = fs.readFileSync(modulePath + '/manifest.json', 'utf8');
			moduleManifest = JSON.parse(moduleManifest);
		} catch (e){
			return;
		}

		if (!moduleManifest.rights) return;

		fields = [];
		moduleManifest.rights.forEach(function(right){
			manifest.formSpec.fields[moduleName + '_' + right.key] = {
				type: 'boolean',
				name: 'modules[' + moduleName + '][' + right.key + ']',
				label: right.description
			};
			fields.push(moduleName + '_' + right.key);
		});

		manifest.formSpec.groups[moduleName] = {
			name: moduleManifest.name || moduleName,
			fields: fields
		};

		manifest.formSpec.pages[0].groups.push(moduleName);
	});

	return manifest;
};
