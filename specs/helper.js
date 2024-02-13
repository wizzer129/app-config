/* eslint-disable no-console, import/no-extraneous-dependencies, global-require */

/* BEWARE: HACK-LEVEL MESS
 *
 * Jasmine is a little funny. It injects it's over verison of 'this' into each test...
 * This makes it bit hard to have "helpful" helpers on a global scale. Soooooooo,
 * we hack around it using a global in node.js land. *sigh* yes. deal with it.
 *
 * Usage:
 *
 * { request } = global.__helpers;
 * request.get('/test-url');
 *
 */
const registry = require('../src/registry.js');

global.__helpers = {
	util: require('util'),
	path: require('path'),
	fs: require('fs'),
	registry,
	to: registry.resolve('libTo'),
	Doh: registry.resolve('Doh'),
	mocks: registry.resolve('mocksService'),
	fsMock: require('mock-fs'),
	rMock: require('mock-require'),
};

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at:', p, 'reason:', reason);
	fail();
});

process.on('uncaughtException', (error) => {
	console.log('uncaughtException', error);
	fail();
});

// Fix jasmine.fail() and done.fail() to check for a Doh
// type object and properly find the WHOLE stack trace
const jasFail = global.jasmine.currentEnv_.fail;
global.jasmine.currentEnv_.fail = (error) => {
	if (error instanceof global.__helpers.Doh) {
		return jasFail(error.stack);
	}
	return jasFail(error);
};
