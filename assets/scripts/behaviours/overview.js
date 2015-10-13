'use strict';

var getParent = require('domhelpers/getParent');

module.exports = function(el) {
	var checkbox = el.querySelector('thead input[type=checkbox]');
	var checkboxes = el.querySelectorAll('tbody input[type=checkbox]');

	var i;
	checkbox.addEventListener('change', function(e) {
		for (i = 0; i < checkboxes.length; i++) {
			checkboxes[i].checked = checkbox.checked;
		}
	});

	el.addEventListener('click', function(e) {
		var action = e.target.dataset.action;
		if (!action) return;

		var tr = getParent(e.target, 'tr');
		var name = tr.querySelector(':nth-child(2)').textContent;
		if (action === 'delete') {
			if (!confirm('Delete item "' + name + '"?')) {
				e.preventDefault();
			}
		}
	});
};
