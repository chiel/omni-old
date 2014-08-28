'use strict';

var AuthError = function(code, message){
	this.code = code;
	this.message = message;
};

AuthError.prototype = Object.create(Error.prototype);
AuthError.prototype.constructor = AuthError;

module.exports = AuthError;
