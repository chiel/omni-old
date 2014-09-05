'use strict';

var fs = require('fs'),
	path = require('path'),
	Module = require('../modules/module/module'),
	modules = require('./modules'),
	app = require('./app');

module.exports = function(modulesPath){
	modulesPath = path.normalize(modulesPath);
	if (!fs.existsSync(modulesPath)){
		throw new Error('Cannot load modules from path', modulesPath);
	}

	var moduleList = fs.readdirSync(modulesPath);
	if (!moduleList || !moduleList.length) return;

	var i, len = moduleList.length, moduleName, modulePath, mod;
	for (i = 0; i < len; i++){
		moduleName = moduleList[i];
		modulePath = modulesPath + '/' + moduleName;
		if (
			/^[_.]/.test(moduleName) ||
			!fs.statSync(modulePath).isDirectory()
		) continue;

		mod = new Module(modulePath);
		modules[mod.dirName] = mod;

		if (mod.router){
			app.use('/' + mod.manifest.slug, mod.router);
		}
	}
};
