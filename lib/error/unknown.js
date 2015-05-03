'use strict';

var UnknownError = function(){
	this.name = 'UnknownError';
	this.status = 500;
};

require('inherits')(UnknownError, Error);

UnknownError.prototype.toJSON = function(){
	return { type: 'unknown' };
};

module.exports = UnknownError;
