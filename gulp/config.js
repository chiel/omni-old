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
		targets: [
			{
				src: root + '/node_modules/finder.js/index.scss',
				dest: root + '/assets/styles/vendor/_finder.scss'
			},
			{
				src: root + '/node_modules/normalize.css/normalize.css',
				dest: root + '/assets/styles/vendor/_normalize.scss'
			},
			{
				src: root + '/node_modules/node-bourbon/assets/stylesheets',
				dest: root + '/assets/styles/vendor/bourbon'
			}
		]
	}
};

module.exports = config;
