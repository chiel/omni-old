'use strict';

var behaviour = require('behaviour'),
	informal = require('informal');

behaviour.register('data-informal', function(el){
	var spec = el.querySelector('[data-informal-spec]'),
		data = el.querySelector('[data-informal-data]');
	if (!spec) return;

	try {
		spec = JSON.parse(spec.textContent);
		data = JSON.parse(data.textContent);
	} catch(e){
		console.log(e);
	}

	var form = new informal.Form(spec, data);
	form.attach(el);
});

behaviour.execute();