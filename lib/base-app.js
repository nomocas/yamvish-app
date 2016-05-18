/**
 * Common stuffs between server and browser
 */

var y = require('yamvish');

// load basical yamvish plugins
require('yamvish-c3po');
require('yamvish-router');

// load session
y.env.session = require('./session');

module.exports = new y.Context();
