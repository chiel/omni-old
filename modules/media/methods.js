'use strict';

var Promise = require('promise');

var NotFoundError = require('../../lib/errors/notfound');
var UnknownError = require('../../lib/errors/unknown');

/**
 * @param {Module} mod
 */
module.exports = function(mod){
	/**
	 * Find a single item matching given query
	 *
	 * @param {Object} query
	 *
	 * @return {Promise}
	 */
	var findOne = function(query){
		return new Promise(function(resolve, reject){
			mod.Model.findOne(query, function(err, item){
				if (err){
					console.error('UNHANDLED', err);
					return reject(new UnknownError());
				}

				if (!item){
					return reject(new NotFoundError('Could not find item'));
				}
				resolve(item);
			});
		});
	};

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
		findOne: findOne,
		updateFocus: updateFocus
	};
};
