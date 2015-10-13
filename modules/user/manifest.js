'use strict';

var merge = require('mout/object/merge');

/**
 * Modify the manifest
 *
 * @param {Object} manifest
 *
 * @return {Object}
 */
module.exports = function(manifest) {
	var baseForm = {
		tabs: [{ objects: [ 'email', 'roles', 'superadmin' ]}],

		fields: {
			email: {
				type: 'email',
				label: 'E-mail',
				required: true,
				unique: true,
				autofocus: true
			},
			roles: {
				type: 'api_multi_option',
				style: 'checkbox',
				label: 'Roles',
				endpoint: '/roles/',
				valueField: '_id',
				labelField: 'name'
			},
			superadmin: {
				type: 'boolean',
				label: 'Super admin'
			}
		}
	};

	var createForm = merge({}, baseForm);
	var updateForm = merge({}, baseForm, {
		fields: {
			password: {
				type: 'password',
				label: 'Password',
				required: true
			}
		}
	});
	updateForm.tabs[0].objects.splice(1, 0, 'password');

	manifest.forms = {
		create: createForm,
		update: updateForm
	};

	return manifest;
};
