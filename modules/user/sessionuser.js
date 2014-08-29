'use strict';

var SessionUser = function(data){
	if (!(this instanceof SessionUser)){
		return new SessionUser(data);
	}

	this.data = data;
};

module.exports = SessionUser;
