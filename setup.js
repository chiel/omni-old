#!/usr/bin/env node
'use strict';

var readline = require('readline'),
	client = require('mongodb').MongoClient,
	bcrypt = require('bcrypt'),
	config = require('./core/config');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question('E-mail: ', function(email){
	rl.question('Password: ', function(pass){
		bcrypt.hash(pass, 10, function(err, hash) {
			client.connect(config.mongo, function(err, db){
				if (err){
					console.log('Failed to connect to mongodb');
					return;
				}

				var doc = {email: email, password: hash};
				db.collection('user').insert(doc, function(err){
					if (err){
						console.log('Failed to create user');
						return;
					}

					console.log('User created');
					process.exit(0);
				});
			});
		});
	});
});
