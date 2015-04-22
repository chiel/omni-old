'use function';

var cache = require('../core/cache');

module.exports = function(modulePath){
	var modules = cache.get('modules') || [];
	modules.push(modulePath);
	cache.set('modules', modules);
};
