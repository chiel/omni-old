'use strict';

var path = require('path');
var root = path.normalize(__dirname + '/..');

module.exports = function(to, from){
	var m = to.match(/^\$([^\/]+)/), rp;
	if (m){
		rp = '/modules/' + m[1] + '/views';
		if (m[1] === 'core') rp = '/views';
		return to.replace(m[0], root + rp);
	}
	from = from ? path.dirname(from) : root + '/views';
	return path.resolve(from, to);
};
