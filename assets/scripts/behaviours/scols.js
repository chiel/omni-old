'use strict';

var SCols = require('scols');

module.exports = function(el, options) {
	var scols = new SCols(el, options);
	scols.bind('position', function() {
		scols.setContainerHeight();
	});
};
