'use strict';

var SessionUser = function(data){
	if (!(this instanceof SessionUser)){
		return new SessionUser(data);
	}

	this.data = data;
};

SessionUser.prototype.can = function(right, moduleName){
	return this.data.superadmin;
};

module.exports = SessionUser;
