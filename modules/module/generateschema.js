'use strict';

var forOwn = require('mout/object/forOwn'),
	mongoose = require('mongoose');

var types = {
	text: String,
	textarea: String,
	email: String,
	password: String,
	number: Number,
	date: Date,
	time: String,
	boolean: Boolean,
	single_option: String,
	multi_option: Array
};

module.exports = function(mod){
	if (!mod.manifest || !mod.manifest.formSpec) return;

	var fields = mod.manifest.formSpec.fields,
		schema = {}, o, p;

	forOwn(fields, function(field, name){
		name = field.name || name;
		name = name.replace('][', '.').replace('[', '.').replace(/\]$/, '');
		name = name.split('.');

		o = schema;
		while (name.length){
			p = name.shift();
			if (!name.length) break;

			if (!o[p]){
				o[p] = {};
			}
			o = o[p];
		}

		o[p] = types[field.type];
	});

	return new mongoose.Schema(schema);
};
