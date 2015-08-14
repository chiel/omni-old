'use strict';

var config = require('./config');
var debug = require('debug')('omni:core:db');

debug('initialising database connection to `' + config.mongo + '`');
require('mongoose').connect(config.mongo);
