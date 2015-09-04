'use strict';

var fs = require('fs');

module.exports = [{% for template in templates %}
	{
		type: '{{ template.type }}',
		name: '{{ template.name }}',
		description: '{{ template.description }}',
		html: fs.readFileSync('{{ template.path }}/index.html', 'utf8')
	}{% if !loop.last %},{% endif %}
{% endfor %}];
