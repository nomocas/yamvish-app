/** 
 * server specific
 */

var y = require('yamvish'),
	mainContext = require('../base-app');
y.env.debug = true;
y.isServer = true;
y.isClient = false;

// load twopass engines
require('yamvish/lib/output-engine/twopass');
y.router = require('yamvish-router/lib/twopass');

module.exports = mainContext;
