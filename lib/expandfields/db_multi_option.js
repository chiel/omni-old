'use strict';

var Promise = require('promise'),
	modules = require('../../core/modules');

module.exports = function(field){
	return new Promise(function(resolve, reject){
		if (!field.module || !modules[field.module]) return resolve(field);

		var mod = modules[field.module];
		mod.Model.find(function(err, items){
			if (err) return reject(err);

			field.options = [];
			for (var i = 0; i < items.length; i++){
				field.options.push({
					value: items[i]._id,
					label: items[i].name
				});
			}
			resolve(field);
		});
	});
};
