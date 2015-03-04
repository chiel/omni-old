'use strict';

var fs = require('fs'),
	loadConfig = require('./lib/loadconfig'),
	loadModule = require('./lib/loadmodule');

module.exports = function(configPath){
	loadConfig(__dirname + '/config.json');
	loadConfig(configPath);
	require('./core/setup');
	require('./core/middleware');

	fs.readdirSync(__dirname + '/modules').forEach(function(moduleName){
		loadModule(__dirname + '/modules/' + moduleName);
	});

	return {
		loadModule: loadModule,
		listen: function(){
			require('./core/listen')();
		}
	};
};
