'use strict';

var fs = require('fs');
var path = require('path');
var browserify = require('browserify');
var concat = require('concat-stream');
var sourcemaps = require('gulp-sourcemaps');
var file = require('gulp-file');
var root = __dirname + '/../..';

module.exports = function(gulp, config){
	gulp.task('browserify', [ 'blocks', 'templates' ], function(){
		var handleBundle = function(name){
			return concat(function(body){
				return file(path.basename(name), body, { src: true })
					.pipe(gulp.dest(path.dirname(name)));
			});
		};

		var inputs = [];
		var outputs = [];
		var target;

		for (var i = 0; i < config.browserify.targets.length; i++){
			target = config.browserify.targets[i];
			inputs.push(target.input);
			outputs.push(handleBundle(target.output));
		}

		var aliasify = require('aliasify').configure({
			aliases: config.browserify.aliases
		});

		return browserify(inputs)
			.transform(aliasify, { global: true })
			.transform(require('brfs'), { global: true })
			.plugin(require('factor-bundle'), { outputs: outputs })
			.bundle().pipe(handleBundle(config.browserify.common));
	});
};
