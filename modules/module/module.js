'use strict';

var fs = require('fs'),
	mongoose = require('mongoose'),
	generateSchema = require('./generateschema'),
	generateRouter = require('./generaterouter');

var Module = function(modulePath){
	if (!(this instanceof Module)){
		return new Module();
	}

	this.path = modulePath;

	this.loadManifest();
	this.loadSchema();
	this.loadModel();
	this.loadRouter();
};

Module.prototype.loadManifest = function(){
	try {
		this.manifest = JSON.parse(fs.readFileSync(this.path + '/manifest.json', 'utf8'));
	} catch(e){
		if (e.code != 'ENOENT'){
			console.error(e.message);
		}
		this.manifest = {};
	}

	if (!this.manifest.slug){
		this.manifest.slug = this.path.match(/([^\/]+)$/)[0];
		if (this.manifest.slug == 'root') this.manifest.slug = '';
	}

	if (fs.existsSync(this.path + '/manifest.js')){
		this.manifest = require(this.path + '/manifest')(this);
	}
};

Module.prototype.loadSchema = function(){
	if (fs.existsSync(this.path + '/schema.js')){
		this.schema = require(this.path + '/schema')();
		return;
	}

	this.schema = generateSchema(this);
};

Module.prototype.loadModel = function(){
	if (this.schema){
		this.Model = mongoose.model(this.manifest.slug, this.schema, this.manifest.slug);
	}
};

Module.prototype.loadRouter = function(){
	if (fs.existsSync(this.path + '/router.js')){
		this.router = require(this.path + '/router')();
		return;
	}

	this.router = generateRouter(this);
};

module.exports = Module;