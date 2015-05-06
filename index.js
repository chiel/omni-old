'use strict';

var fs = require('fs');
var cache = require('./core/cache');
var loadConfig = require('./lib/loadconfig');
var registerModule = require('./lib/register_module');

module.exports = function(config){
	loadConfig(require(__dirname + '/config.json'));
	loadConfig(config);
	require('./core/setup');
	require('./core/middleware');

	fs.readdirSync(__dirname + '/modules').forEach(function(moduleName){
		registerModule(__dirname + '/modules/' + moduleName);
	});

	return {
		registerModule: registerModule,
		listen: function(){
			require('./core/listen')();
		},
		setNavigation: function(nav){
			cache.set('navigation', nav);
		}
	};
};
