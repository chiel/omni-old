'use strict';

var loadConfig = function() {
	var el = document.querySelector('[data-config]');
	if (!el) return {};

	try {
		return JSON.parse(el.textContent);
	} catch (err) {
		return {};
	}
};

module.exports = loadConfig();
