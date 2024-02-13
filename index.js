// This removes the nano-config from the require.cache each time it's included
delete require.cache[__filename];

const registry = require('./src/registry');
module.exports = {
	config: registry.resolve('ConfigFactory')(module.parent.filename),
}
