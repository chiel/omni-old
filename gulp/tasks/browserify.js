'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var browserify = require('browserify');
var root = __dirname + '/../..';

module.exports = function(gulp, config){
	gulp.task('browserify', function(){
		var inputs = [], outputs = [], i, target;
		var filePath = '/tmp/pageblocks.js';
		var contents = '"use strict";';

		for (i = 0; i < config.browserify.blocks.length; i++){
			contents += 'require("' + config.browserify.blocks[i] + '");';
		}
		fs.writeFileSync(filePath, contents);
		config.browserify.targets.push({
			input: filePath,
			output: path.normalize(root + '/public/js/page/blocks.js'),
			watch: []
		});

		filePath = '/tmp/pagetemplates.js';
		contents = '"use strict";var templates = require("builder/templates");var fs = require("fs");';

		var tpl, tplName;
		for (i = 0; i < config.browserify.templates.length; i++){
			tpl = config.browserify.templates[i];
			tplName = tpl.match(/([^\/]+)$/)[1];
			contents += 'templates["' + tplName + '"] = fs.readFileSync("' + tpl + '/index.html", "utf8");';
		}
		fs.writeFileSync(filePath, contents);
		config.browserify.targets.push({
			input: filePath,
			output: path.normalize(root + '/public/js/page/templates.js'),
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
			.transform(require('brfs'), { global: true })
			.plugin(require('factor-bundle'), { outputs: outputs })
			.bundle().pipe(fs.createWriteStream(config.browserify.common));
	});
};
