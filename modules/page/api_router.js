'use strict';

var adaptors = require('../../core/adaptors');
var forOwn = require('mout/object/forOwn');
var mongoose = require('mongoose');
var Promise = require('promise');

var NotFoundError = require('../../lib/errors/notfound');
var UnknownError = require('../../lib/errors/unknown');

module.exports = function(mod, auth){
	var router = require('express').Router();

	router.get(/\/([a-zA-Z0-9]+)/, auth, function(req, res){
		mod.methods.findOne({ slug: req.params[0] }).then(
			function(item){
				var i, block;
				var promises = [];
				var promiseIndices = [];

				forOwn(item.zones, function(blocks, zoneName){
					for (i = 0; i < blocks.length; i++){
						block = blocks[i];
						if (adaptors[block.type]){
							promiseIndices.push({ zone: zoneName, block: i });
							promises.push(adaptors[block.type](block.data, mongoose));
						}
					}
				});

				if (!promises.length){
					return res.json(item);
				}

				Promise.all(promises).then(function(resolved){
					var index;
					for (i = 0; i < resolved.length; i++){
						index = promiseIndices[i];
						item.zones[index.zone][index.block].data = resolved[i];
					}

					res.json(item);
				}, function(){
					res.json(item);
				});
			},
			function(err){
				res
					.status(err.status || 500)
					.json({ error: err });
			}
		);
	});

	return router;
};
