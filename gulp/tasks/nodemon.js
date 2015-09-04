'use strict';

var nodemon = require('nodemon');

module.exports = function(gulp, config){
	gulp.task('nodemon', function(){
		nodemon(config.nodemon);
	});
};
