'use function';

var debug = require('debug')('omni:modules:register');
var cache = require('../core/cache');

module.exports = function(modulePath){
	debug('registering `' + modulePath + '`');
	var modules = cache.get('modules') || [];
	modules.push(modulePath);
	cache.set('modules', modules);
};
