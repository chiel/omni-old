'use strict';

var NotFoundError = function(message){
	this.name = 'NotFoundError';
	this.message = message;
	this.status = 404;
};

require('inherits')(NotFoundError, Error);

NotFoundError.prototype.toJSON = function(){
	return {
		name: 'notfound',
		message: this.message
	};
};

module.exports = NotFoundError;
