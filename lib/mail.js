'use strict';

var config = require('../core/config');
var Promise = require('promise');
var request = require('request');

var UnknownError = require('./error/unknown');

/**
 *
 */
var send = function(data){
	return new Promise(function(resolve, reject){
		request({
			method: 'post',
			auth: {
				user: 'api',
				password: config.mailgun.api_key
			},
			url: 'https://api.mailgun.net/v3/' + config.mailgun.api_domain + '/messages',
			form: data,
			json: true
		}, function(err, res, body){
			if (err){
				console.error('UNHANDLED', err);
				return reject(new UnknownError());
			}

			if (res.statusCode < 200 || res.statusCode > 299){
				console.error(res.statusCode, body);
				reject(new UnknownError('Something went wrong while sending the mail'));
			}

			resolve(body);
		});
	});
};

module.exports = {
	send: send
};
