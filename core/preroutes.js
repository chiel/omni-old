'use strict';

var SessionUser = require('../modules/user/sessionuser');

require('./app')
	.use(function(req, res, next){
		if (req.session.userData){
			req.session.user = new SessionUser(req.session.userData);
		}
		next();
	})
	.use(function(req, res, next){
		if (!req.session.user && req.path != '/login/'){
			return res.redirect('/login/?forward=' + encodeURIComponent(req.path));
		}
		next();
	})
	.use(function(req, res, next){
		res.locals.user = req.session.user;
		next();
	});
