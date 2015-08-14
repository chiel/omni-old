'use strict';

var bcrypt = require('bcrypt');

module.exports = function(mod, generateSchema){
	var schema = generateSchema(mod);

	schema.options.toObject = {
		transform: function(doc, ret, options){
			delete ret.password;
			delete ret.__v;
		}
	};

	schema.pre('save', function(next){
		var self = this;

		bcrypt.hash(self.password, 10, function(err, hash){
			if (err) return next(err);

			self.password = hash;
			next();
		});
	});

	return schema;
};
