'use strict';

var fs = require('fs');
var mongoose = require('mongoose');
var adaptors = require('../../core/adaptors');
var auth = require('../../core/middleware/auth');
var generateSchema = require('./generators/schema');
var generateRouter = require('./generators/router');

var Module = function(modulePath){
	if (!(this instanceof Module)){
		return new Module();
	}

	this.path = modulePath;
	this.dirname = this.path.split('/').pop();

	this.loadManifest();
	this.loadSchema();
	this.createModel();
	this.loadAdaptors();
	this.loadApiRouter();
	this.loadRouter();
};

Module.prototype.loadManifest = function(){
	var manifest = {};
	if (fs.existsSync(this.path + '/manifest.json')){
		manifest = require(this.path + '/manifest.json');
	}

	var dirname = this.dirname.match(/(?:omni\.cm-)?(.*)/)[1];
	manifest.slug = manifest.slug !== undefined ? manifest.slug : dirname;
	manifest.collection = manifest.collection || dirname;

	if (fs.existsSync(this.path + '/manifest.js')){
		manifest = require(this.path + '/manifest')(manifest);
	}

	this.manifest = manifest;
};

Module.prototype.loadSchema = function(){
	if (fs.existsSync(this.path + '/schema.js')){
		this.schema = require(this.path + '/schema')(this, generateSchema);
		return;
	}

	this.schema = generateSchema(this);
};

Module.prototype.createModel = function(){
	if (!this.schema) return;

	this.Model = mongoose.model(
		this.manifest.collection,
		this.schema,
		this.manifest.collection
	);
};

Module.prototype.loadAdaptors = function(){
	var dir = this.path + '/adaptors';
	if (!fs.existsSync(dir)) return;

	var match;
	var files = fs.readdirSync(dir);
	for (var i = 0; i < files.length; i++){
		match = files[i].match(/^(.*)\.js$/);
		if (match){
			adaptors[match[1]] = require(dir + '/' + match[1]);
		}
	}
};

Module.prototype.loadApiRouter = function(){
	if (fs.existsSync(this.path + '/api_router.js')){
		this.apiRouter = require(this.path + '/api_router')(this, auth);
		return;
	}
};

Module.prototype.loadRouter = function(){
	if (fs.existsSync(this.path + '/router.js')){
		this.router = require(this.path + '/router')(this, generateRouter);
		return;
	}

	this.router = generateRouter(this);
};

module.exports = Module;
