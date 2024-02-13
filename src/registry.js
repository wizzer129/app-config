/* eslint-disable global-require, import/no-dynamic-require, no-unused-vars, no-use-before-define */

const createRegistry = () => {
	// Map of names to awilix registry type
	const mappings = {};
	// Include Awilix for DI/IoC
	const { asValue, asFunction, asClass, createContainer, listModules, Lifetime, InjectionMode } = require('awilix');

	// Create our DI container
	const registry = createContainer({
		injectionMode: InjectionMode.PROXY,
	});

	// Load node_modules our app needs
	const camelCase = require('camelcase');
	const _ = require('lodash');
	const path = require('path');
	const { to } = require('await-to-js');

	// Put these in the registry so we can pull them out later to override DI
	mappings.asValue = asValue(asValue);
	mappings.asFunction = asValue(asFunction);
	mappings.asClass = asValue(asClass);

	// Assign Mappings
	mappings.libFS = asValue(require('fs'));
	mappings.libDebug = asValue(require('debug'));

	mappings.libTo = asValue(to);
	mappings.libPath = asValue(path);
	mappings._ = asValue(_);

	// Use awilix to glob our modules
	const services = listModules([
	// Globs!
		'service/**/*.js',
	], { cwd: __dirname });
	// We want to register `UserService` as `userService`
	services.forEach((module) => {
		mappings[camelCase(module.name)] = asClass(
			require(module.path),
			{ lifetime: Lifetime.TRANSIENT },
		);
	});

	// Use awilix to glob our libs
	const libs = listModules([
	// Globs!
		'lib/**/*.js',
	], { cwd: __dirname });

	// We want to register `UserLib` as `UserLib`
	libs.forEach((module) => {
		mappings[module.name] = asValue(
			require(module.path),
			{ lifetime: Lifetime.TRANSIENT },
		);
	});
	//
	// Use awilix to glob our factory methods
	const factories = listModules([
	// Globs!
		'factory/**/*.js',
	], { cwd: __dirname });

	// We want to register `ConfigFactory` as `ConfigFactory`
	factories.forEach((module) => {
		mappings[module.name] = asFunction(
			(cradle) => (...args) => {
				const Fact = require(module.path);
				return new Fact(cradle, ...args);
			},
			{
				lifetime: Lifetime.TRANSIENT,
				injectionMode: InjectionMode.Classic,
			},
		);
	});

	// Actually inject the mappings into the registry
	_.each(mappings, (resolver, name) => {
		registry.register(name, resolver);
	});

	// Include special cases into registry
	registry.register('registry', asValue(registry, { lifetime: Lifetime.SINGLETON }));
	registry.register('mappings', asValue(mappings, { lifetime: Lifetime.SINGLETON }));
	const nameToRequire = (name) => {
		let found;
		found = _.find(services, { name });
		if (found !== undefined) {
			return require(found.path);
		}
		found = _.find(libs, { name });
		if (found !== undefined) {
			return require(found.path);
		}
		throw new Error(`Could not find: ${name} in registry`);
	};
	registry.register('nameToRequire', asValue(nameToRequire, { lifetime: Lifetime.SINGLETON }));
	return registry;
};

module.exports = createRegistry();
