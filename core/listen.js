'use strict';

var app = require('./app');
var cache = require('./cache');
var config = require('./config');
var listen = require('listen.js');
var loadModule = require('../lib/loadmodule');

module.exports = function(){
	var modules = cache.get('modules');
	for (var i = 0; i < modules.length; i++){
		loadModule(modules[i]);
	}
	listen(app, config.listen);
};
