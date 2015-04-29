'use strict';

var forOwn = require('mout/object/forOwn');
var all = require('then-all');

var expanders = {
	db_multi_option: require('./db_multi_option')
};

module.exports = function(fields, cb){
	var names = [];
	var promises = [];
	forOwn(fields, function(field, name){
		if (expanders[field.type]){
			promises.push(expanders[field.type](field));
			names.push(name);
		}
	});

	if (!promises.length) return cb(null, fields);

	all(promises).then(function(specs){
		for (var i = 0; i < specs.length; i++){
			fields[names[i]] = specs[i];
		}
		cb(null, fields);
	}, function(){
		console.log('handle errors');
	});
};
