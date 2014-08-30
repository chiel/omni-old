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

	var i, len = modules.length, moduleName, modulePath, router, mountPath, manifest;
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

		manifest = undefined;
		if (fs.existsSync(modulePath + '/manifest.json')){
			try {
				manifest = JSON.parse(fs.readFileSync(modulePath + '/manifest.json', 'utf8'));
				if (manifest.mount){
					mountPath = '/' + manifest.mount;
				}
			} catch(e){
				console.log('Failed to parse manifest for module %s', moduleName);
			}
		}

		app.use(mountPath, router);
	}
};

load(process.cwd() + '/modules');
