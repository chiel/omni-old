'use strict';

var fs = require('fs'),
	http = require('http'),
	net = require('net'),
	isString = require('mout/lang/isString'),
	config = require('./config'),
	server = http.createServer(require('./app'));

if (isString(config.listen)){
	server.on('error', function(e){
		if (e.code != 'EADDRINUSE') return;

		var clientSocket = new net.Socket();
		clientSocket.on('error', function(e){
			if (e.code != 'ECONNREFUSED') return;

			fs.unlinkSync(config.listen);
			server.listen(config.listen);
		});

		clientSocket.connect({path: config.listen}, function(){
			console.log('Socket %s is in use, exiting...', config.listen);
			process.exit();
		});
	});
} else {
	server.on('error', function(e){
		if (e.code != 'EADDRINUSE') return;

		console.log('Port %d is in use, exiting...', config.listen);
	});
}

server.on('listening', function(){
	if (isString(config.listen)){
		console.log('Omni is listening on socket %s', config.listen);
	} else {
		console.log('Omni is listening on port %d', config.listen);
	}
});

server.listen(config.listen);
