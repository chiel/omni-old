'use strict';

var browserify = require('browserify');
var concat = require('concat-stream');
var file = require('gulp-file');
var gutil = require('gulp-util');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var watchify = require('watchify');

module.exports = function(gulp, config){
	gulp.task('scripts', [ 'blocks', 'templates' ], function(){
		var entries = config.scripts.targets.map(function(target){
			return target.input;
		});

		var createOutputStreams = function(){
			return config.scripts.targets.map(function(target){
				return handleBundle(target.output);
			});
		};

		var handleBundle = function(name){
			return concat(function(body){
				return file(path.basename(name), body, { src: true })
					.pipe(sourcemaps.init({ loadMaps: true }))
					.pipe(sourcemaps.write('.'))
					.pipe(gulp.dest(path.dirname(name)));
			});
		};

		var bundler = browserify({ entries: entries, debug: true })
			.transform(require('aliasify').configure({
				aliases: config.scripts.aliases
			}), { global: true })
			.transform(require('brfs'), { global: true })
			.plugin(require('factor-bundle'), { outputs: createOutputStreams });

		var bundle = function(){
			return bundler.bundle().pipe(handleBundle(config.scripts.common));
		}

		if (!gutil.env.production){
			bundler = watchify(bundler);
			bundler.on('update', bundle);
		}

		return bundle();
	});
};
