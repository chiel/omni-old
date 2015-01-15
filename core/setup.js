'use strict';

var app = require('./app'),
	config = require('./config'),
	swig = require('swig'),
	session = require('express-session'),
	RedisStore = require('connect-redis')(session);

require('./db');

app
	.engine('html', swig.renderFile)
	.set('view engine', 'html')
	.set('views', __dirname + '/../views')
	.enable('strict routing')
	.use(require('serve-static')(__dirname + '/../public'))
	.use(require('connect-slashes')())
	.use(require('body-parser').urlencoded({extended: true}))
	.use(require('body-parser').json())
	.use(session({
		store: new RedisStore(),
		name: config.session.name,
		secret: config.session.secret,
		resave: true,
		saveUninitialized: true
	}));

var swigDefaults = {
	loader: require('./swig/loader')
};

if (app.settings.env == 'development'){
	swigDefaults.cache = false;
}

swig.setDefaults(swigDefaults);
