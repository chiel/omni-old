'use strict';

var fs = require('fs'),
	path = require('path'),
	views = path.normalize(__dirname + '/../../views');

module.exports = {
	resolve: function(to, from){
		var m = to.match(/^\$([^\/]+)/);
		if (m){
			if (m[1] == 'core'){
				return to.replace(m[0], views);
			} else {
				return to.replace(m[0], process.cwd() + '/modules/' + m[1] + '/views');
			}
		}
		from = from ? path.dirname(from) : views;
		return path.resolve(from, to);
	},

	load: function(identifier, cb){
		if (cb){
			fs.readFile(identifier, 'utf8', cb);
			return;
		}
		return fs.readFileSync(identifier, 'utf8');
	}
};
