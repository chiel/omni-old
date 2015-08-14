'use strict';

var debug = require('debug')('omni:core:config');
var deepMixIn = require('mout/object/deepMixIn');
var config = require('../core/config');

module.exports = function(conf){
	if (!conf) return;

	debug(conf);
	deepMixIn(config, conf);
};
