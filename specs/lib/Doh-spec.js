const { Doh } = global.__helpers;

describe('Doh', () => {
	it('matches Error', () => {
		const err = new Error('test'); const d = new Doh('test');

		expect(err.name).toEqual(d.name);
		expect(err.message).toEqual(d.message);
		expect(err.stack).toEqual(d.stack.replace('5:44', '5:15'));
	});

	it('throw an error', () => {
		expect(() => {
			const q = new Doh('test');
			const err = new Doh('second error', q);
			const nextErr = new Doh('third error', err);
			throw nextErr;
		}).toThrow(new Doh('third error'));
	});

	it('to have chained errors in the stack trace', () => {
		const first = new Doh('first');
		const second = new Doh('second', first);
		const third = new Doh('third', second);
		const forth = new Doh('forth', third);
		const fifth = new Doh('fifth', forth);

		const out = fifth.stack;

		expect(out).toContain('Error: fifth');
		expect(out).toContain('Error: forth');
		expect(out).toContain('Error: third');
		expect(out).toContain('Error: second');
		expect(out).toContain('Error: first');
	});

	it('Error in chain works fine', () => {
		const first = new Error('first');
		const second = new Doh('second', first);
		const third = new Doh('third', second);
		const forth = new Doh('forth', third);
		const fifth = new Doh('fifth', forth);

		const out = fifth.stack;

		expect(out).toContain('Error: fifth');
		expect(out).toContain('Error: forth');
		expect(out).toContain('Error: third');
		expect(out).toContain('Error: second');
		expect(out).toContain('Error: first');
	});
});
