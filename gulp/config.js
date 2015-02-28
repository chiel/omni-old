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
		script: './app.js',
		watch: []
	},
	sass: {
		options: {
			includePaths: [root + '/assets/styles']
		},
		targets: []
	}
};

module.exports = config;
