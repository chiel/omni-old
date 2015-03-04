'use strict';

var root = __dirname + '/../..';

module.exports = function(req, res, next){
	var oldRender = res.render;

	res.render = function(path, locals, cb){
		var m = path.match(/^\$([^\/]+)/);
		if (m){
			if (m[1] == 'core'){
				path = path.replace(m[0], root + '/views');
			} else {
				path = path.replace(m[0], root + '/modules/' + m[1] + '/views');
			}
		}
		oldRender.call(res, path, locals, cb);
	};

	next();
};
