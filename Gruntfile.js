'use strict';

var fs = require('fs'),
	path = require('path'),
	readCssDir = require('./lib/readcssdir'),
	readJsDir = require('./lib/readjsdir');

module.exports = function(grunt){
	require('matchdep').filterDev('grunt-*').forEach(function(plugin){
		grunt.loadNpmTasks('omni/node_modules/' + plugin);
	});

	var config = {
		concurrent: {
			preDev: {
				tasks: ['sass', 'browserify']
			},
			dev: {
				tasks: ['nodemon:dev', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},

		browserify: {omni: {files: {}}},

		sass: {
			options: {
				includePaths: [__dirname + '/css']
			}
		},

		nodemon: {
			dev: {
				script: path.normalize(__dirname + '/../../app.js')
			}
		},

		watch: {
			js_omni: {
				files: [],
				tasks: ['browserify:omni']
			}
		}
	};

	readCssDir(config, __dirname + '/css', 'omni');
	readJsDir(config, __dirname + '/js');

	fs.readdirSync(__dirname + '/modules')
	.forEach(function(moduleName){
		var modulePath = __dirname + '/modules/' + moduleName;
		readCssDir(modulePath + '/css', moduleName);
		readJsDir(modulePath + '/js', moduleName);
	});

	grunt.initConfig(config);

	grunt.registerTask('default', ['concurrent:preDev', 'concurrent:dev']);
};
