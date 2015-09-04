'use strict';

var nodemon = require('nodemon');

module.exports = function(gulp, config){
	gulp.task('nodemon', [ 'blocks', 'templates' ], function(){
		nodemon(config.nodemon);
	});
};
