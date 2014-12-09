'use strict';

var fs = require('fs'),
	path = require('path'),
	views = path.normalize(__dirname + '/../../views');

module.exports = {
	resolve: function(to, from){
		if (/^\$omni/.test(to)){
			return to.replace('$omni', views);
		}
		from = from ? path.dirname(from) : views;
		return path.resolve(from, to);
	},

	load: function(identifier, cb){
		if (cb) {
			fs.readFile(identifier, 'utf8', cb);
			return;
		}
		return fs.readFileSync(identifier, 'utf8');
	}
};
