'use strict';

var root = __dirname + '/..';

var config = {
	sass: {
		options: {
			includePaths: [root + '/assets/css']
		},
		targets: []
	},
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
	}
};

module.exports = config;
