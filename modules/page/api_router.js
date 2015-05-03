'use strict';

var adaptors = require('../../core/adaptors');
var forOwn = require('mout/object/forOwn');
var mongoose = require('mongoose');
var Promise = require('promise');
var NotFoundError = require('../../lib/error/notfound');
var UnknownError = require('../../lib/error/unknown');

module.exports = function(mod, auth){
	var router = require('express').Router();

	router.get(/\/([a-zA-Z0-9]+)/, auth, function(req, res){
		mod.Model.findOne({ slug: req.params[0] }, function(err, doc){
			if (err){
				console.error(err);
				err = new UnknownError();
				return res.status(err.status).json({ error: err });
			}

			if (!doc){
				err = new NotFoundError('Could not find page with slug `' + req.params[0] + '`');
				return res.status(err.status).json({ error: err });
			}

			var i, block;
			var promises = [];
			var promiseIndices = [];

			forOwn(doc.zones, function(blocks, zoneName){
				for (i = 0; i < blocks.length; i++){
					block = blocks[i];
					if (adaptors[block.type]){
						promiseIndices.push({ zone: zoneName, block: i });
						promises.push(adaptors[block.type](block.properties, mongoose));
					}
				}
			});

			if (!promises.length){
				return res.json(doc);
			}

			Promise.all(promises).then(function(resolved){
				var index;
				for (i = 0; i < resolved.length; i++){
					index = promiseIndices[i];
					doc.zones[index.zone][index.block].properties = resolved[i];
				}

				res.json(doc);
			}, function(){
				res.json(doc);
			});
		});
	});

	return router;
};
