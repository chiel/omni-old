'use strict';

var swig = require('swig'),
	session = require('express-session'),
	RedisStore = require('connect-redis')(session),
	app = require('./app'),
	config = require('./config'),
	SessionUser = require('../modules/user/sessionuser');

app
	.engine('html', require('consolidate').swig)
	.set('view engine', 'html')
	.set('views', process.cwd() + '/views')
	.enable('strict routing')
	.use(require('serve-static')(process.cwd() + '/public'))
	.use(require('connect-slashes')())
	.use(require('body-parser').urlencoded({extended: true}))
	.use(session({
		store: new RedisStore(),
		name: config.session.name || 'omni.sid',
		secret: config.session.secret,
		resave: true,
		saveUninitialized: true
	}))
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

if (app.settings.env == 'development'){
	swig.setDefaults({cache: false});
}
