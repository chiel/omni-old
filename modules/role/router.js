'use strict';

var fs = require('fs');

module.exports = function(router, manifest){
	var dir = process.cwd() + '/modules',
		modules = fs.readdirSync(dir),
		modulePath, moduleManifest, fields;

	modules.forEach(function(moduleName){
		modulePath = dir + '/' + moduleName;

		try {
			moduleManifest = fs.readFileSync(modulePath + '/manifest.json', 'utf8');
			moduleManifest = JSON.parse(moduleManifest);
		} catch(e){
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

	return router;
};
