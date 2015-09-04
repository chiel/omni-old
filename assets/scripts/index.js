'use strict';

var informal = require('informal/all');
informal.fields.api_multi_option = require('./fields/api_multi_option');
informal.fields.markdown = require('./fields/markdown');
informal.fields.slug = require('./fields/slug');

var behaviour = require('behaviour');
behaviour.register('data-form', require('./behaviours/form'));
behaviour.register('data-overview', require('./behaviours/overview'));
behaviour.execute();
