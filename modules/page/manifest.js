'use strict';

var cache = require('../../core/cache');
var fs = require('fs');
var map = require('mout/array/map');
var sort = require('mout/array/sort');

module.exports = function(manifest){
	var modules = cache.get('modules');
	var dir, templateDir, meta;
	var templates = [];

	modules.forEach(function(modulePath){
		dir = modulePath + '/templates';
		if (fs.existsSync(dir)){
			fs.readdirSync(dir).forEach(function(templateName){
				templateDir = dir + '/' + templateName;
				if (fs.existsSync(templateDir + '/meta.json')){
					meta = require(templateDir + '/meta.json');
					meta.machine_name = templateName;
					templates.push(meta);
				}
			});
		}
	});

	manifest.formSpec.fields.template.options = sort(map(templates, function(t){
		return {
			value: t.machine_name,
			label: t.name || t.machine_name
		};
	}), function(a, b){
		return a.label > b.label ? 1 : a.label < b.label ? -1 : 0;
	});

	return manifest;
};
