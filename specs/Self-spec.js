const { path } = global.__helpers;

describe('Self', () => {
	it('Can require() this module', (done) => {
		expect(() => {
			// eslint-disable-next-line global-require, import/no-dynamic-require
			const lib = require(path.resolve(__dirname, '..'));
			expect(typeof lib).toBe('object');

			expect(Object.prototype.hasOwnProperty.call(lib, 'config')).toBe(true);
			expect(lib.config.all()).toEqual({});
		}).not.toThrow();

		done();
	});
});
