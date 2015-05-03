'use strict';

var fs = require('fs');
var mongoose = require('mongoose');
var generateSchema = require('./generateschema');
var generateRouter = require('./generaterouter');

var Module = function(modulePath){
	if (!(this instanceof Module)){
		return new Module();
	}

	this.path = modulePath;
	this.dirName = this.path.match(/([^\/]+)$/)[0];

	this.loadManifest();
	this.loadSchema();
	this.loadModel();
	this.loadApiRouter();
	this.loadRouter();
};

Module.prototype.loadManifest = function(){
	var manifest;
	if (fs.existsSync(this.path + '/manifest.json')){
		manifest = require(this.path + '/manifest.json');
	} else {
		manifest = {};
	}

	if (!manifest.slug){
		manifest.slug = this.dirName == 'root' ? manifest.slug = '' : this.dirName;
	}

	if (!manifest.unit){
		manifest.unit = this.dirName.match(/(?:omni\.cm-)?(.*)/)[1];
	}

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

Module.prototype.loadModel = function(){
	if (this.schema){
		this.Model = mongoose.model(this.manifest.unit, this.schema, this.manifest.unit);
	}
};

Module.prototype.loadApiRouter = function(){
	if (fs.existsSync(this.path + '/api_router.js')){
		this.apiRouter = require(this.path + '/api_router')(this);
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
