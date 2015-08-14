'use strict';

var app = require('./app');
var swig = require('swig');
var debug = require('debug')('omni:core:setup');

require('./db');

debug('global app settings');
app
.engine('html', swig.renderFile)
.set('view engine', 'html')
.set('views', __dirname + '/../views')
.enable('strict routing');

var swigDefaults = {
	loader: require('./swig/loader')
};

if (app.settings.env == 'development'){
	debug('disabling swig cache');
	swigDefaults.cache = false;
}

swig.setDefaults(swigDefaults);
swig.setFilter('render_nav', require('./swig/filters/render_nav'));
