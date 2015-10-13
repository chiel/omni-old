'use strict';

var SessionUser = function(data) {
	if (!(this instanceof SessionUser)) {
		return new SessionUser(data);
	}

	this.data = data;
};

SessionUser.prototype.can = function(right, moduleName) {
	return this.data.superadmin ||
		(this.data.rights[moduleName] &&
		this.data.rights[moduleName][right] === true);
};

module.exports = SessionUser;
