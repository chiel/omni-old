'use strict';

/**
 * Render a finder in darkbox
 */
module.exports = function(opts){
	var self = this;

	self.fit(900, 600, {
		callback: function(width, height){
			opts.finder.open(self.content, opts.path);
			opts.finder.on('file.selected', function(path){
				opts.callback(path);
				self.close();
			});
			self.content.classList.add('is-loaded');
		}
	});
};
