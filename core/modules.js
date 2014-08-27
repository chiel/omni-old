'use strict';

var path = require('path'),
	fs = require('fs'),
	isFunction = require('mout/lang/isFunction'),
	app = require('./app');

var load = function(modulesPath){
	modulesPath = path.normalize(modulesPath);
	if (!fs.existsSync(modulesPath)){
		throw new Error('Cannot load modules from path', modulesPath);
	}

	var modules = fs.readdirSync(modulesPath);
	if (!modules || !modules.length) return;

	var i, len = modules.length, moduleName, modulePath, router, mountPath;
	for (i = 0; i < len; i++){
		moduleName = modules[i];
		modulePath = modulesPath + '/' + moduleName;
		if (
			/^[_.]/.test(moduleName) ||
			!fs.statSync(modulePath).isDirectory() ||
			!fs.existsSync(modulePath + '/router.js')
		) continue;

		router = require(modulePath + '/router');
		if (!isFunction(router)) continue;

		mountPath = '/' + (moduleName == 'root' ? '' : moduleName);
		app.use(mountPath, router);
	}
};

load(process.cwd() + '/modules');
