'use strict';

var root = __dirname + '/..';

var config = {
	gulpfiles: [],
	blocks: [],
	templates: [],
	scripts: {
		aliases: {
			builder: root + '/assets/scripts/builder',
			'builder/blocks': root + '/gulp/tmp/blocks.js',
			'builder/templates': root + '/gulp/tmp/templates.js',
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
			'blocks/',
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
