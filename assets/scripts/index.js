'use strict';

var behaviour = require('behaviour');
behaviour.register('data-form', require('./behaviours/form'));
behaviour.execute();
