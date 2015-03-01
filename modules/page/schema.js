'use strict';

module.exports = function(mod, generate){
	generate.types.zone_builder = generate.mongooseTypes.Mixed;
	return generate(mod);
};
