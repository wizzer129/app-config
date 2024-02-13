class DebugService {
	constructor({ libDebug }) {
		this.debug = libDebug;
		this.yell = null;
		this.prefix = 'nano-config';
		this.name();
	}

	name(name) {
		this.yell = this.debug(`${this.prefix}:${name}`);
		return this;
	}

	say(...args) {
		this.yell(...args);
	}
}

module.exports = DebugService;
