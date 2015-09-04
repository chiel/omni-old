'use strict';

module.exports = [{% for block in blocks %}
	require('{{ block }}'){% if !loop.last %},{% endif %}
{% endfor %}];
