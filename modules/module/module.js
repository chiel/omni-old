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
	this.dirName = this.path.match(/([^\/]+)$/)[0];

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
		this.manifest.slug = this.dirName == 'root' ? this.manifest.slug = '' : this.dirName;
	}

	if (fs.existsSync(this.path + '/manifest.js')){
		this.manifest = require(this.path + '/manifest')(this);
	}
};

Module.prototype.loadSchema = function(){
	if (fs.existsSync(this.path + '/schema.js')){
		this.schema = require(this.path + '/schema')(this);
		return;
	}

	this.schema = generateSchema(this);
};

Module.prototype.loadModel = function(){
	if (this.schema){
		this.Model = mongoose.model(this.dirName, this.schema, this.dirName);
	}
};

Module.prototype.loadRouter = function(){
	if (fs.existsSync(this.path + '/router.js')){
		this.router = require(this.path + '/router')(this);
		return;
	}

	this.router = generateRouter(this);
};

module.exports = Module;
