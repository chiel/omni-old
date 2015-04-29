'use strict';

var app = require('./app');
var swig = require('swig');

require('./db');

app
.engine('html', swig.renderFile)
.set('view engine', 'html')
.set('views', __dirname + '/../views')
.enable('strict routing');

var swigDefaults = {
	loader: require('./swig/loader')
};

if (app.settings.env == 'development'){
	swigDefaults.cache = false;
}

swig.setDefaults(swigDefaults);
swig.setFilter('render_nav', require('./swig/filters/render_nav'));
