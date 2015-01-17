'use strict';

var fs = require('fs'),
	path = require('path'),
	mkdirp = require('mkdirp'),
	browserify = require('browserify');

module.exports = function(gulp, config){
	return function(){
		var inputs = [], outputs = [], i, target;

		for (i = 0; i < config.browserify.targets.length; i++){
			target = config.browserify.targets[i];
			inputs.push(target.input);
			outputs.push(target.output);
			mkdirp.sync(path.dirname(target.output));
		}

		var aliasify = require('aliasify').configure({
			aliases: config.browserify.aliases
		});

		return browserify(inputs)
			.transform(aliasify, { global: true })
			.plugin('factor-bundle', { outputs: outputs })
			.bundle().pipe(fs.createWriteStream(config.browserify.common));
	};
};
