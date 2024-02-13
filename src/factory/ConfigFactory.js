/* eslint-disable global-require, import/no-dynamic-require, no-prototype-builtins */
class ConfigFactory {
	constructor({ _, libPath, libFS, debugService }, requiredBy) {
		this._ = {
			get: _.get,
			hasIn: _.hasIn,
			merge: _.merge,
		};

		this.path = {
			dirname: libPath.dirname,
			resolve: libPath.resolve,
			join: libPath.join,
			sep: libPath.sep,
		};
		this.fs = {
			existsSync: libFS.existsSync,
		};
		this.config = null;
		this.debug = debugService.name('ConfigFactory');
		this._setup(requiredBy);
	}

	has(configValue) {
		return this._.hasIn(this.config, configValue);
	}

	get(configValue) {
		return this._.get(this.config, configValue);
	}

	all() {
		return this.config;
	}

	_setup(requiredBy) {
		this.debug.say(`Required by: ${requiredBy}`);

		const configPath = this._findMainPath(requiredBy);
		if (configPath === false) {
			this.debug.say('Could not find config path. Using: {}');
			this.config = this._deepFreeze({});
			return;
		}

		// Find the config files
		const defaultConfig = this._findDefaultConfig(configPath);
		const envConfig = this._findEnvConfig(configPath);

		// Merge with the env config
		this.config = this._.merge(defaultConfig, envConfig);

		// Freeze the object
		this.config = this._deepFreeze(this.config);
	}

	_findDefaultConfig(configPath) {
		let cnf;
		try {
			cnf = require(this.path.resolve(`${configPath}/default.js`));
			this.debug.say('Found default.js');
		} catch (e) {
			this.debug.say('Could not find default.js. Using: {}');
			cnf = {};
		}
		return cnf;
	}

	_findEnvConfig(configPath) {
		let cnf;
		this.debug.say(`Search for Env ${process.env.NODE_ENV}`);
		if (
			process.env.NODE_ENV === null
			|| process.env.NODE_ENV === ''
			|| process.env.NODE_ENV === undefined
		) {
			return {};
		}

		try {
			cnf = require(this.path.resolve(`${configPath}/${process.env.NODE_ENV}.js`));
			this.debug.say(`Found ${process.env.NODE_ENV}.js`);
		} catch (e) {
			this.debug.say(`Could not find ${process.env.NODE_ENV}.js. Using: {}`);
			cnf = {};
		}
		return cnf;
	}

	_deepFreeze(o) {
		Object.freeze(o);
		const that = this;
		Object.getOwnPropertyNames(o).forEach((prop) => {
			if (o.hasOwnProperty(prop)
			&& o[prop] !== null
			&& (typeof o[prop] === 'object' || typeof o[prop] === 'function')
			&& !Object.isFrozen(o[prop])) {
				that._deepFreeze(o[prop]);
			}
		});

		return o;
	}

	_findMainPath(requiredBy) {
		let found = false;
		let count = requiredBy.split(this.path.sep).length - 1;
		let lookingIn = requiredBy;

		while (count > 0) {
			count -= 1;

			lookingIn = this.path.dirname(lookingIn);
			this.debug.say(`Searching in: ${lookingIn}`);
			const packageJson = this.path.join(lookingIn, 'package.json');
			const configPath = this.path.join(lookingIn, 'config');
			if (
				this.fs.existsSync(packageJson)
				&& this.fs.existsSync(configPath)
			) {
				found = configPath;
				this.debug.say(`Found config path in: ${found}`);
				break;
			}
		}

		return found;
	}
}

module.exports = ConfigFactory;
