'use strict';

var forOwn = require('mout/object/forOwn');
var mongoose = require('mongoose');
var isArray = require('mout/lang/isArray');

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
	multi_option: [String],
	db_multi_option: [mongoose.Schema.Types.ObjectId],
	list: mongoose.Schema.Types.Mixed,
	expanding_textarea: String,
	finder: String
};

var generateSchema = function(mod){
	if (!mod.manifest || !mod.manifest.formSpec) return;

	var fields = mod.manifest.formSpec.fields;
	var schema = {}, o, p, def;

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

		if (isArray(types[field.type])){
			def = { type: types[field.type][0] };
		} else {
			def = { type: types[field.type] };
		}

		if (field.required){
			def.required = true;
		}

		if (field.default !== undefined){
			def.default = field.default;
		}

		if (field.unique){
			def.index = { unique: true };
		}

		if (field.type == 'db_multi_option'){
			def.ref = field.module;
		}

		if (isArray(types[field.type])){
			def = [def];
		}

		o[p] = def;
	});

	return new mongoose.Schema(schema);
};

generateSchema.types = types;
generateSchema.mongooseTypes = mongoose.Schema.Types;

module.exports = generateSchema;
