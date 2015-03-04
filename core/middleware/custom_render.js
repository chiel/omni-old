'use strict';

var getTemplatePath = require('../../lib/get_template_path');

module.exports = function(req, res, next){
	var oldRender = res.render;

	res.render = function(path, locals, cb){
		oldRender.call(res, getTemplatePath(path), locals, cb);
	};

	next();
};
