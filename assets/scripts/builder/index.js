'use strict';

var Darkbox = require('darkbox');
var bind = require('mout/function/bind');
var forOwn = require('mout/object/forOwn');
var getClosest = require('domhelpers/getClosest');
var indexOf = require('mout/array/indexOf');

/**
 * Create new page builder
 */
var Builder = function(options){
	if (!(this instanceof Builder)){
		return new Builder(options);
	}

	options = options || {};

	if (!options.blocks) options.blocks = [];
	if (!options.templates) options.templates = [];

	this.options = options;
	this.blockId = 0;
	this.blocks = {};
	this.zones = {};
	this._build();
	this._setEvents();
};

require('util').inherits(Builder, require('events').EventEmitter);

/**
 * Build up required elements
 */
Builder.prototype._build = function(){
	if (this.wrap) return;

	this.darkbox = new Darkbox();

	var wrap = document.createElement('div');
	wrap.classList.add('builder', 'has-no-layout');

	var blocksWrap = document.createElement('div');
	blocksWrap.classList.add('builder-blocks');
	wrap.appendChild(blocksWrap);
	this.blocksWrap = blocksWrap;

	var template = document.createElement('div');
	template.classList.add('builder-template');
	wrap.appendChild(template);
	this.template = template;

	var placeholder = document.createElement('div');
	placeholder.classList.add('builder-placeholder');
	this.placeholder = placeholder;

	var Block;
	var block;
	var blockTypes = {};
	for (var i = 0; i < this.options.blocks.length; i++){
		Block = this.options.blocks[i];
		block = document.createElement('article');
		block.dataset.type = Block.meta.type;
		block.textContent = Block.meta.name || Block.meta.type;
		block.draggable = true;
		blockTypes[Block.meta.type] = Block;
		blocksWrap.appendChild(block);
	}

	var template;
	var templates = {};
	for (i = 0; i < this.options.templates.length; i++){
		template = this.options.templates[i];
		templates[template.type] = template;
	}

	this.blockTypes = blockTypes;
	this.templates = templates;
	this.wrap = wrap;
};

/**
 * Set required events
 */
Builder.prototype._setEvents = function(){
	var self = this;

	// drag new block from list
	self.blocksWrap.addEventListener('dragstart', function(e){
		e.dataTransfer.dropEffect = 'copy';
		self.emit('dragstart', e.target.dataset.type);
	});

	// drag existing block in template
	self.template.addEventListener('dragstart', function(e){
		e.dataTransfer.dropEffect = 'move';
		self.emit('dragstart', e.target.dataset.type, e.target);
	});

	// entering / leaving zones
	document.body.addEventListener('dragover', function(e){
		var zoneEl = getClosest(e.target, '[data-zone]');

		if (self.hoverZone){
			var hoverEl = self.zones[self.hoverZone];
			if (zoneEl !== hoverEl){
				self.emit('zone:leave', self.hoverZone);
			}
		}

		if (zoneEl){
			if (zoneEl.dataset.droppable) e.preventDefault();
			self.emit('zone:enter', zoneEl.dataset.zone);
		}
	});

	// ordering of blocks
	self.template.addEventListener('dragenter', function(e){
		var zoneEl = getClosest(e.target, '[data-zone]');
		if (!zoneEl) return;

		e.preventDefault();

		if (e.target == self.placeholder) return;

		var block = getClosest(e.target, '[data-id]');
		if (!block) return;

		var placeholderIndex = indexOf(zoneEl.children, self.placeholder);
		var blockIndex = indexOf(zoneEl.children, block);

		if (placeholderIndex === -1) return;

		zoneEl.insertBefore(self.placeholder, placeholderIndex > blockIndex ? block : block.nextSibling);
	});

	// wrap up
	document.body.addEventListener('dragend', function(e){
		self.emit('dragend');
	});

	self.template.addEventListener('click', function(e){
		self.showBlock(e.target.dataset.id);
	});

	self.bound = {
		dragStart: bind(this.dragStart, this),
		dragEnd: bind(this.dragEnd, this),
		zoneEnter: bind(this.zoneEnter, this),
		zoneLeave: bind(this.zoneLeave, this)
	};

	self.on('dragstart', self.bound.dragStart);
	self.on('dragend', self.bound.dragEnd);
	self.on('zone:enter', self.bound.zoneEnter);
	self.on('zone:leave', self.bound.zoneLeave);
};

/**
 * Start dragging a block
 */
Builder.prototype.dragStart = function(type, block){
	this.dragType = type;
	this.dragBlock = block;

	if (block){
		setTimeout(bind(function(){
			block.parentNode.insertBefore(this.placeholder, block);
			block.style.display = 'none';
		}, this), 1);
	}

	var Block = this.blockTypes[type];
	this.placeholder.textContent = Block.meta.name;

	var tplName = this.templateName;
	forOwn(this.zones, function(zone, zoneName){
		if (!Block.meta.constrain || Block.meta.constrain.test(tplName + '.' + zoneName)){
			zone.classList.add('is-block-droppable');
			zone.dataset.droppable = true;
			return;
		}

		zone.classList.add('is-not-block-droppable');
	});
};

/**
 * Stop dragging a block
 */
Builder.prototype.dragEnd = function(){
	if (!this.dragType) return false;

	var hoverEl = this.zones[this.hoverZone];
	if (hoverEl){
		var droppable = hoverEl.dataset.droppable;
	}

	forOwn(this.zones, function(zoneEl){
		zoneEl.classList.remove('is-block-droppable');
		zoneEl.classList.remove('is-not-block-droppable');
		delete zoneEl.dataset.droppable;
	});

	var blockEl = this.dragBlock;
	if (!blockEl && (!hoverEl || !droppable)) return;

	if (!blockEl){
		var id = this.addBlock(this.dragType, this.hoverZone);
		blockEl = this.blocks[id].blockEl;
	} else{
		blockEl.style.display = '';
	}

	this.placeholder.parentNode.insertBefore(blockEl, this.placeholder);
	this.placeholder.parentNode.removeChild(this.placeholder);

	this.dragType = undefined;
	this.dragBlock = undefined;
};

/**
 * Dragged block enters zone
 *
 * @param {String} zoneName
 */
Builder.prototype.zoneEnter = function(zoneName){
	if (zoneName === this.hoverZone) return;

	var zoneEl = this.zones[zoneName];

	if (zoneEl.dataset.droppable){
		if (indexOf(zoneEl.children, this.placeholder) === -1){
			zoneEl.appendChild(this.placeholder);
		}
	}

	this.hoverZone = zoneName;
};

/**
 * Dragged block enters zone
 *
 * @param {String} zoneName
 */
Builder.prototype.zoneLeave = function(zoneName){
	if (!this.hoverZone) return;

	var zoneEl = this.zones[zoneName];
	if (!this.dragBlock && indexOf(zoneEl.children, this.placeholder) > -1){
		zoneEl.removeChild(this.placeholder);
	}

	this.hoverZone = undefined;
};

/**
 * Add a block of type to a zone
 *
 * @param {String} type
 * @param {String} zoneName
 */
Builder.prototype.addBlock = function(type, zoneName){
	if (!this.blockTypes[type] || !this.zones[zoneName]) return;

	var Block = this.blockTypes[type];
	if (Block.meta.constrain && !Block.meta.constrain.test(this.templateName + '.' + zoneName)) return;

	var id = this.blockId++;
	var blockEl = document.createElement('article');
	blockEl.textContent = Block.meta.name;
	blockEl.dataset.type = Block.meta.type;
	blockEl.dataset.id = id;
	blockEl.draggable = true;
	this.blocks[id] = {
		Block: Block,
		blockEl: blockEl
	};

	this.zones[zoneName].appendChild(blockEl);

	return id;
};

/**
 *
 */
Builder.prototype.showBlock = function(id){
	id = parseInt(id);
	var blockDef = this.blocks[id];
	if (!blockDef) return;

	this.darkbox.open('block', {
		block: blockDef.Block,
		data: blockDef.data,
		callback: function(data){
			blockDef.data = data;
		}
	});
};

/**
 * Set template
 *
 * @param {String} templateName
 */
Builder.prototype.setTemplate = function(templateName){
	var template = this.templates[templateName];
	if (!template){
		this.template.innerHTML = '';
		this.zones = {};
		this.wrap.classList.add('has-no-layout');
		return;
	}

	this.wrap.classList.remove('has-no-layout');
	this.template.innerHTML = template.html;
	this.templateName = templateName;
	this.zones = {};
	var zones = this.template.querySelectorAll('[data-zone]');
	for (var i = 0; i < zones.length; i++){
		this.zones[zones[i].dataset.zone] = zones[i];
	}
};

module.exports = Builder;
