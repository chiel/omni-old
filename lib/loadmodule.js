'use strict';

var fs = require('fs');
var app = require('../core/app');
var modules = require('../core/modules');
var Module = require('../modules/module/module');

module.exports = function(modulePath){
	if (!fs.existsSync(modulePath)){
		throw new Error('Cannot load module `' + modulePath.match(/[^\/]+$/)[0] + '` from path `' + modulePath + '`');
	}

	var mod = new Module(modulePath);
	modules[mod.dirName] = mod;

	if (mod.router){
		app.use('/' + mod.manifest.slug, mod.router);
	}
};
