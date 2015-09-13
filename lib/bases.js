'use strict';

var base62 = {
	characters: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',

	/**
	 * Generate a random base62 token of given length
	 *
	 * @param {Number} length
	 *
	 * @return {String}
	 */
	generateToken: function(length){
		var chars = this.characters;
		var token = [];

		while (length){
			token.push(chars[ Math.floor(Math.random() * chars.length) ]);
			length--;
		}
		return token.join('');
	}
};

module.exports = {
	base62: base62
};
