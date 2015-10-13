'use strict';

var symlink = require('gulp-symlink');

module.exports = function(gulp, config) {
	gulp.task('symlink', function() {
		var i, target, srcs = [], dests = [];

		for (i = 0; i < config.symlink.targets.length; i++) {
			target = config.symlink.targets[i];
			srcs.push(target.src);
			dests.push(target.dest);
		}

		return gulp.src(srcs).pipe(symlink(dests, config.symlink.options));
	});
};
