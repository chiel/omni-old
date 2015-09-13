'use strict';

var isArray = require('mout/lang/isArray');
var isFunction = require('mout/lang/isFunction');
var Promise = require('promise');

var DuplicateError = require('../../../lib/error/duplicate');
var UnknownError = require('../../../lib/error/unknown');

/**
 * Execute given hooks with given arguments
 *
 * @param {Object} hooks
 * @param {Array} args
 * @param {Function} cb
 */
var processHooks = function(hooks, args, cb){
	if (!hooks) return;

	if (isFunction(args)){
		cb = args;
		args = [];
	} else if (!isArray(args)){
		args = [ args ];
	}

	if (!isArray(hooks)){
		hooks = [ hooks ];
	}

	var index = 0;
	var nextHook = function(){
		if (!hooks[index]) return cb();
		hooks[index].apply(hooks[index], args);
	};

	var afterHook = function(err){
		if (err){
			return cb(err);
		}
		index++;
		nextHook();
	};

	args.push(afterHook);

	nextHook();
};

/**
 * Generate methods for given module
 *
 * @param {Module} mod
 *
 * @return {Object}
 */
module.exports = function(mod){
	/**
	 * Create a new entity of given model
	 *
	 * @param {Object} data
	 *
	 * @return {Promise}
	 */
	var create = function(data){
		return new Promise(function(resolve, reject){
			try{
				mod.validators.create(data);
			} catch (err){
				reject(err);
			}

			var save = function(){
				var item = new mod.Model(data);
				item.save(function(err, item){
					if (err){
						if (err.name === 'MongoError' && err.code === 11000){
							var fieldName = err.message.match(/\$(.*)_\d+\s+dup key.*$/);
							return reject(new DuplicateError(fieldName ? fieldName[1] : false));
						}

						console.error('UNHANDLED', err);
						return reject(new UnknownError());
					}

					resolve(item);
				});
			};

			if (create.hooks && create.hooks.pre){
				processHooks(create.hooks.pre, data, function(err){
					if (err) return reject(err);
					save();
				});
			} else{
				save();
			}
		});
	};

	return {
		create: create
	};
};
