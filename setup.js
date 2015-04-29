#!/usr/bin/env node
'use strict';

require('./lib/loadconfig')(__dirname + '/config.json');
require('./core/db');

var readline = require('readline');
var Module = require('./modules/module/module');
var mod = new Module(__dirname + '/modules/user');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question('E-mail: ', function(email){
	rl.question('Password: ', function(pass){
		new mod.Model({
			email: email,
			password: pass,
			superadmin: true
		}).save(function(err){
			if (err){
				console.error(err);
				process.exit(1);
			}

			console.log('User created');
			process.exit(0);
		});
	});
});
