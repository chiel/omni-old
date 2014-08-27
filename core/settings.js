'use strict';

var swig = require('swig'),
	app = require('./app');

app
	.engine('html', require('consolidate').swig)
	.set('view engine', 'html')
	.set('views', process.cwd() + '/views')
	.enable('strict routing')
	.use(require('serve-static')(process.cwd() + '/public'))
	.use(require('connect-slashes')())
	.use(require('body-parser').urlencoded({extended: true}));

if (app.settings.env == 'development'){
	swig.setDefaults({cache: false});
}
