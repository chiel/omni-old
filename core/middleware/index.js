'use strict';

var debug = require('debug')('omni:core:middleware');
var config = require('../config');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

debug('registering app middleware');
require('../app')
.use(require('serve-static')(__dirname + '/../../public'))
.use('/uploads', require('serve-static')(config.upload.path))
.use(require('connect-slashes')())
.use(require('connect-busboy')())
.use(require('body-parser').urlencoded({extended: true}))
.use(require('body-parser').json())
.use(session({
	store: new RedisStore(),
	name: config.session.name,
	secret: config.session.secret,
	resave: false,
	saveUninitialized: true
}))
.use(require('./ensure_auth'))
.use(require('./custom_render'))
.use(require('./view_locals'));

debug('registering api middleware');
require('../api')
.use(require('connect-slashes')(false))
.use(require('body-parser').json());
