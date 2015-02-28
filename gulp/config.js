'use strict';

var root = __dirname + '/..';

var config = {
	browserify: {
		aliases: {
			informal: root + '/node_modules/informal'
		},
		common: root + '/public/js/common.js',
		targets: []
	},
	nodemon: {
		ext: 'js json',
		ignore: [
			'.git/',
			'assets/',
			'gulp/',
			'gulpfile.js',
			'node_modules/',
			'public/'
		],
		script: './app.js',
		watch: []
	},
	sass: {
		options: {
			includePaths: [root + '/assets/styles']
		},
		targets: []
	},
	symlink: {
		options: {
			force: true
		},
		targets: []
	}
};

module.exports = config;
