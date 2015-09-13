'use strict';

var UnknownError = function(message){
	this.name = 'UnknownError';
	this.message = message;
	this.status = 500;
};

require('inherits')(UnknownError, Error);

UnknownError.prototype.toJSON = UnknownError.prototype.toObject = function(){
	var json = { type: 'unknown' };
	if (this.message){
		json.message = this.message;
	}

	return json;
};

module.exports = UnknownError;
