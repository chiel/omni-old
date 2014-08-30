'use strict';

var behaviour = require('behaviour'),
	informal = require('informal');

behaviour.register('data-informal', function(el){
	var spec = el.querySelector('[data-informal-spec]');
	if (!spec) return;

	try {
		spec = JSON.parse(spec.textContent);
	} catch(e){
		console.log(e);
	}

	var form = new informal.Form(spec);
	form.attach(el);
});

behaviour.execute();
