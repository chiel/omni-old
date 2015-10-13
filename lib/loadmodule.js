'use strict';

var debug = require('debug')('omni:modules:load');
var fs = require('fs');
var api = require('../core/api');
var app = require('../core/app');
var modules = require('../core/modules');
var Module = require('../modules/module/module');

module.exports = function(modulePath) {
	debug('loading module --- ' + modulePath);
	if (!fs.existsSync(modulePath)) {
		throw new Error('Cannot load module `' + modulePath.match(/[^\/]+$/)[0] + '` from path `' + modulePath + '`');
	}

	var mod = new Module(modulePath);
	modules[mod.dirname] = mod;

	if (mod.apiRouter) {
		debug('mounting api routes on `/' + mod.manifest.slug + '`');
		api.use('/' + (mod.manifest.apiSlug || mod.manifest.slug), mod.apiRouter);
	}
	if (mod.router) {
		debug('mounting app routes on `/' + mod.manifest.slug + '`');
		app.use('/' + mod.manifest.slug, mod.router);
	}
};
