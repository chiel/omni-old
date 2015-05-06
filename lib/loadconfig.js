'use strict';

var deepMixIn = require('mout/object/deepMixIn');
var config = require('../core/config');

module.exports = function(conf){
	if (conf) deepMixIn(config, conf);
};
