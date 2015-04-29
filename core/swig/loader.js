'use strict';

var fs = require('fs');
var getTemplatePath = require('../../lib/get_template_path');

module.exports = {
	resolve: function(to, from){
		return getTemplatePath(to, from);
	},

	load: function(identifier, cb){
		if (cb){
			fs.readFile(identifier, 'utf8', cb);
			return;
		}
		return fs.readFileSync(identifier, 'utf8');
	}
};
