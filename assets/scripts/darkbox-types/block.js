'use strict';

/**
 * Render a form in darkbox
 */
module.exports = function(opts) {
	var self = this;

	self.fit(640, 480, {
		callback: function(width, height) {
			new opts.block(opts.data, self.content, function(values) {
				opts.callback(values);
				self.close();
			});
			self.content.classList.add('is-loaded');
		}
	});
};
