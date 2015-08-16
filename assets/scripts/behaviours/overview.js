'use strict';

module.exports = function(el){
	var checkbox = el.querySelector('thead input[type=checkbox]');
	var checkboxes = el.querySelectorAll('tbody input[type=checkbox]');

	var i;
	checkbox.addEventListener('change', function(e){
		for (i = 0; i < checkboxes.length; i++){
			checkboxes[i].checked = checkbox.checked;
		}
	});
};
