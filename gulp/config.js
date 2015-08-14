'use strict';

var root = __dirname + '/..';

var config = {
	gulpfiles: [],
	browserify: {
		aliases: {
			informal: root + '/node_modules/informal'
		},
		blocks: [],
		common: root + '/public/js/common.js',
		targets: [],
		templates: []
	},
	nodemon: {
		ext: 'js json',
		ignore: [
			'.git/',
			'assets/',
			'gulp/',
			'gulpfile.js',
			'modules/**/assets/',
			'modules/**/node_modules/',
			'node_modules/',
			'public/'
		],
		script: './app.js',
		watch: []
	},
	styles: {
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
