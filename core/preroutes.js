'use strict';

var SessionUser = require('../modules/user/sessionuser'),
	views = __dirname + '/../views';

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
	})
	.use(function(req, res, next){
		var oldRender = res.render;

		res.render = function(path, locals, cb){
			var m = path.match(/^\$([^\/]+)/);
			if (m){
				if (m[1] == 'core'){
					path = path.replace(m[0], views);
				} else {
					path = path.replace(m[0], __dirname + '/../modules/' + m[1] + '/views');
				}
			}
			oldRender.call(res, path, locals, cb);
		};

		next();
	});
