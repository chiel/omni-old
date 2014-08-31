'use strict';

require('./app');
require('./config');
require('./settings');

require('./loadmodules')(process.cwd() + '/modules');

require('./listen');
