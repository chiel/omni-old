'use strict';

var nodemon = require('nodemon');

module.exports = function(gulp, config){
	return function(){
		nodemon(config.nodemon);
	};
};
