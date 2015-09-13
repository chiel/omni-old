'use strict';

var forOwn = require('mout/object/forOwn');
var isArray = require('mout/lang/isArray');
var mongoose = require('mongoose');
var set = require('mout/object/set');

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
	multi_option: [ String ],
	api_multi_option: [ mongoose.Schema.Types.ObjectId ],
	list: mongoose.Schema.Types.Mixed,
	expanding_textarea: String,
	markdown: String,
	finder: String,
	slug: String,
	builder: mongoose.Schema.Types.Mixed
};

var generateSchema = function(mod){
	if (!mod.manifest || !mod.manifest.forms) return;

	var fields = mod.manifest.forms.create.fields;
	var schema = {};
	var def;

	forOwn(fields, function(field, name){
		name = (field.name || name).replace(/\[/g, '.').replace(/\]/g, '');
		field.type = field.type || 'text';

		if (isArray(types[field.type])){
			def = { type: types[field.type][0] };
		} else{
			def = { type: types[field.type] };
		}

		if (field.required){
			def.required = true;
		}

		if (field.unique){
			def.index = { unique: true };
		}

		if (isArray(types[field.type])){
			def = [ def ];
		}

		set(schema, name, def);
	});

	schema = new mongoose.Schema(schema);
	schema.options.toJSON = { transform: function(doc, ret, options){
		delete ret.__v;
	}};

	return schema;
};

generateSchema.types = types;
generateSchema.mongooseTypes = mongoose.Schema.Types;

module.exports = generateSchema;
