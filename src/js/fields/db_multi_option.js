'use strict';

var prime = require('prime'),
	FieldMultiOption = require('informal').fields.multi_option;

var FieldDbMultiOption = prime({
	inherits: FieldMultiOption,

	constructor: function(spec, value){
		if (!(this instanceof FieldDbMultiOption)){
			return new FieldDbMultiOption(spec, value);
		}
		FieldMultiOption.call(this, spec, value);
	}
});

module.exports = FieldDbMultiOption;
