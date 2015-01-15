'use strict';

var behaviour = require('behaviour'),
	informal = require('informal'),
	request = require('superagent');

informal.registerField('db_multi_option', require('informal/src/fields/multi_option'));
informal.registerField('value_list', require('./fields/value_list'));

behaviour.register('data-informal', function(el){
	var spec = el.querySelector('[data-informal-spec]'),
		data = el.querySelector('[data-informal-data]');
	if (!spec) return;

	try {
		spec = JSON.parse(spec.textContent);
		data = JSON.parse(data.textContent);
	} catch(e){}

	var form = new informal.Form(spec, data);
	el.insertBefore(form.wrap, el.firstChild);
	el.addEventListener('submit', function(e){
		e.preventDefault();

		var method = el.getAttribute('method'),
			action = el.getAttribute('action');

		request[method](action).send(form.getValues()).end(function(err, response){
			if (err){
				console.error(err);
				return;
			}

			if (response.header.location){
				if (history.pushState){
					history.pushState(null, null, response.header.location);
					el.setAttribute('action', response.header.location);
				} else {
					window.location = response.header.location;
				}
			}
		});
	});
});

behaviour.execute();
