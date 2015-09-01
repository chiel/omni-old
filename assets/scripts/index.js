'use strict';

var informal = require('informal/all');
informal.fields.api_multi_option = require('./fields/api_multi_option');
informal.fields.markdown = require('./fields/markdown');

var behaviour = require('behaviour');
behaviour.register('data-form', require('./behaviours/form'));
behaviour.register('data-overview', require('./behaviours/overview'));
behaviour.execute();
