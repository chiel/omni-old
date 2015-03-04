'use strict';

var config = require('../config'),
	session = require('express-session'),
	RedisStore = require('connect-redis')(session);

require('../app')
	.use(require('serve-static')(__dirname + '/../../public'))
	.use(require('connect-slashes')())
	.use(require('body-parser').urlencoded({extended: true}))
	.use(require('body-parser').json())
	.use(session({
		store: new RedisStore(),
		name: config.session.name,
		secret: config.session.secret,
		resave: true,
		saveUninitialized: true
	}))
	.use(require('./ensure_auth'))
	.use(require('./custom_render'))
	.use(require('./view_locals'));
