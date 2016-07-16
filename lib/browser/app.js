/** 
 * browser app specific
 */
y = require('yamvish'); // load it as global browser side
y.env.debug = true;
y.isClient = true;
y.isServer = false;

// main context from index (common stufs between server and browser)
var mainContext = y.mainContext = require('../base-app');

require('./login');

// load session immediatly from storage
y.env.session.load();

// load dom router engine
y.router = require('yamvish-router/lib/dom');

// bind main context to browser history
y.router.bindHistory(mainContext);

// automatically save session when modified
mainContext.env.subscribe('session', function(value) {
	this.data.session.save();
}, true);

module.exports = mainContext;
