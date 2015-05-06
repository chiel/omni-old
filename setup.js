#!/usr/bin/env node
'use strict';

var argv = require('yargs')
.demand([ 'mongo', 'email', 'password'])
.argv;

require('mongoose').connect(argv.mongo);

var Module = require('./modules/module/module');
var user = new Module(__dirname + '/modules/user');

new user.Model({
	email: argv.email,
	password: argv.email,
	superadmin: true
}).save(function(err){
	if (err){
		console.error(err);
		process.exit(1);
	}

	console.log('User created');
	process.exit(0);
});
