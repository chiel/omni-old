'use strict';

var informal = require('informal/all');
var disclose = require('../disclose');

module.exports = function(el){
	var specEl = el.querySelector('[data-informal-spec]');
	var dataEl = el.querySelector('[data-informal-data]');
	if (!specEl) return;

	var spec;
	try{
		spec = JSON.parse(specEl.textContent);
	} catch (e){
		console.error('Failed to parse json for form');
		return;
	}

	var data;
	if (dataEl){
		try{
			data = JSON.parse(dataEl.textContent);
		} catch (e){}
	}

	var form = informal(spec, data);
	specEl.parentNode.insertBefore(form.wrap, specEl);

	var btn = el.querySelector('[type=submit]');
	el.addEventListener('submit', function(e){
		e.preventDefault();

		btn.disabled = true;
		btn.classList.add('is-pending');

		fetch(el.action, {
			method: el.method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(form.getValues())
		})
		.then(function(res){
			res.json().then(function(json){
				console.log(json);
				if (res.status < 200 || res.status > 299){
					disclose.error(json.error.message, { sticky: true });
				} else{
					window.location = '/dashboard/';
				}

				btn.disabled = false;
				btn.classList.remove('is-pending');
			});
		});
	});
};
