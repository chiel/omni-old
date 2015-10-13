'use strict';

var bcrypt = require('bcrypt');

module.exports = function(mod, generateSchema) {
	var schema = generateSchema(mod);

	// add password field to schema
	schema.add({ password: { type: String }});

	schema.options.toObject = schema.options.toJSON = {
		transform: function(doc, ret, options) {
			delete ret.password;
			delete ret.__v;
		}
	};

	return schema;
};
