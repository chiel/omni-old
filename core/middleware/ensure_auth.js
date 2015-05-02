'use strict';

var SessionUser = require('../../modules/user/sessionuser');

module.exports = function(req, res, next){
	if (req.session && req.session.userData){
		req.user = new SessionUser(req.session.userData);
		return next();
	}

	if (!req.user && req.path == '/login/') return next();

	res.redirect('/login/?forward=' + encodeURIComponent(req.path));
};
