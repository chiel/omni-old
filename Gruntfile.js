'use strict';

module.exports = function(grunt){
	grunt.initConfig({
		nodemon: {
			dev: {}
		}
	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.registerTask('default', ['nodemon']);
};
