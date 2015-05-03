'use strict';

var AuthorizationError = function(type, message){
	this.name = 'AuthorizationError';
	this.type = type;
	this.message = message;
	this.status = 403;
};

require('inherits')(AuthorizationError, Error);

AuthorizationError.prototype.toJSON = function(){
	var json = {
		name: 'authorization',
		message: this.message
	};

	if (this.type) json.type = this.type;
	return json;
};

module.exports = AuthorizationError;
