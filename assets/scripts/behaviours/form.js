'use strict';

var informal = require('informal/all');

module.exports = function(el){
	var specEl = el.querySelector('[data-informal-spec]');
	if (!specEl) return;

	var spec;

	try{
		spec = JSON.parse(specEl.textContent);
	} catch (e){
		console.error('Failed to parse json for form');
		return;
	}

	var form = informal(spec);
	specEl.parentNode.insertBefore(form.wrap, specEl);
};
