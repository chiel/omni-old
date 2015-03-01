'use strict';

var fs = require('fs'),
	path = require('path'),
	mkdirp = require('mkdirp'),
	browserify = require('browserify'),
	root = __dirname + '/../..';

module.exports = function(gulp, config){
	return function(){
		var inputs = [], outputs = [], i, target,
			contents = '"use strict";';

		var filePath = '/tmp/pageblocks.js';
		for (i = 0; i < config.browserify.blocks.length; i++){
			contents += 'require("' + config.browserify.blocks[i] + '");';
		}
		fs.writeFileSync(filePath, contents);
		config.browserify.targets.push({
			input: filePath,
			output: path.normalize(root + '/public/js/page/blocks.js'),
			watch: []
		});

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
			.plugin(require('factor-bundle'), { outputs: outputs })
			.bundle().pipe(fs.createWriteStream(config.browserify.common));
	};
};
