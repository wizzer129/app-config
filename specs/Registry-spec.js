const { registry, to } = global.__helpers;

describe('Registry', () => {
	it('Can get mappings and registry from the registry', (done) => {
		const reg = registry.resolve('registry');
		expect(reg).toEqual(registry);

		expect(async () => {
			const mappings = registry.resolve('mappings');
			expect(typeof mappings).toBe('object');
			await to(registry.dispose());
		}).not.toThrow();

		done();
	});
});
