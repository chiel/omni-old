'use strict';

var Promise = require('promise');

var UnknownError = require('../../lib/errors/unknown');

/**
 * @param {Module} mod
 */
module.exports = function(mod){
	/**
	 * Update focus
	 *
	 * @param {Object} data
	 * @param {String} data.path
	 *
	 * @return {Promise}
	 */
	var updateFocus = function(data){
		return new Promise(function(resolve, reject){
			mod.Model.findOneAndUpdate(
				{ path: data.path }, data, { upsert: true },
				function(err, doc){
					if (err){
						console.error('UNHANDLED', err);
						return reject(new UnknownError());
					}

					resolve(doc);
				}
			);
		});
	};

	return {
		updateFocus: updateFocus
	};
};
