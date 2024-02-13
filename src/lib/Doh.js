const { EOL } = require('os');
const { remove, includes } = require('lodash');

class Doh extends Error {
	constructor(message, chainedError) {
		super(message);
		this.chainedError = chainedError;

		Error.captureStackTrace(this, Doh);

		return new Proxy(this, {
			get(target, name) {
				if (name === 'stack') {
					return target.formatStack();
				}
				return target[name];
			},
		});
	}

	formatStack() {
		const out = [];
		const currentStack = this.stack.split(EOL);
		if (this.chainedError !== undefined && this.chainedError !== null) {
			const prevStack = this.chainedError.stack.split(EOL);
			remove(prevStack, (n, index) => {
				// We could have a duplicate error name - always keep the Error: message line
				if (index === 0) return false;
				return includes(currentStack, n);
			});
			out.push(prevStack.join(EOL));
		}

		out.push(currentStack.join(EOL));
		return out.join(EOL);
	}

	inspect() {
		// We see to nee to remove the first line so it doesn't duplicate
		const stack = this.formatStack().split(EOL);
		return stack.slice(1).join(EOL);
	}
}

module.exports = Doh;
