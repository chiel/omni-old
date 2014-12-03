'use strict';

var fs = require('fs');

module.exports = function(grunt){
	var config = {
		mkdir: {
			all: {
				options: {
					create: ['public/css', 'public/js']
				}
			}
		},

		concurrent: {
			preDev: {
				tasks: ['sass', 'browserify']
			},
			dev: {
				tasks: ['nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},

		sass: {
			options: {
				includePaths: ['src/css']
			}
		},

		browserify: {
			base: {
				files: {
					'public/js/base.js': 'src/js/base.js'
				}
			}
		},

		nodemon: {
			dev: {}
		},

		watch: {
			js: {
				files: ['src/js/*.js', 'src/js/**.js'],
				tasks: ['browserify:base']
			}
		}
	};

	var readCssDir = function(dir, target){
		if (!fs.existsSync(dir)) return;

		var count = 0, hasSubdirs, filePath,
			name, input, output, globs;

		fs.readdirSync(dir)
		.forEach(function(fileName){
			if (/^_/.test(fileName)) return;

			if (!config.sass[target]){
				config.sass[target] = {files: {}};
			}

			filePath = dir + '/' + fileName;
			if (fs.statSync(filePath).isDirectory()){
				hasSubdirs = true;
				return;
			}

			name = fileName.match(/(.*)\.scss/)[1];
			input = dir + '/' + name + '.scss';
			output = 'public/css/' + name + '.css';
			config.sass[target].files[output] = input;
			count ++;
		});

		if (count > 0){
			globs = [dir + '/*.scss'];
			if (hasSubdirs){
				globs.push(dir + '/**/*.scss');
			}
			config.watch[target] = {
				files: globs,
				tasks: ['sass:' + target]
			};
		}
	};

	readCssDir(__dirname + '/src/css', 'base');

	fs.readdirSync(__dirname + '/modules')
	.forEach(function(moduleName){
		var modulePath = __dirname + '/modules/' + moduleName;
		readCssDir(modulePath + '/css', moduleName);
	});

	grunt.initConfig(config);

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.registerTask('default', [
		'mkdir',
		'concurrent:preDev',
		'concurrent:dev'
	]);
};
