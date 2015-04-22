'use strict';

var app = require('./app');
var config = require('./config');
var listen = require('listen.js');

module.exports = function(){
	listen(app, config.listen);
};
