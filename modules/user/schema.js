'use strict';

var bcrypt = require('bcrypt');
var generateSchema = require('../module/generateschema');

module.exports = function(mod){
	var schema = generateSchema(mod);

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
