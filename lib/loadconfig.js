'use strict';

var fs = require('fs');
var deepMixIn = require('mout/object/deepMixIn');
var config = require('../core/config');

module.exports = function(file){
	if (!file) return;

	try {
		var conf = fs.readFileSync(file, { encoding: 'utf8' });
		conf = JSON.parse(conf);
		deepMixIn(config, conf);
	} catch(e){
		if (e.code == 'ENOENT'){
			console.error('Could not find config file `%s`', file);
		} else {
			console.error('Could not parse config file `%s`', e.message);
		}
	}
};
