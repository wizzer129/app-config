class MocksService {
	constructor({ registry, _ }) {
		this.registry = registry;
		this.activeMocks = {};
		this._ = {
			each: _.each,
		};
	}

	mock(name, mock, opts) {
		this.mockAsValue(name, mock, opts);
	}

	mockAsValue(name, mock, opts) {
		const asValue = this.registry.resolve('asValue');
		this.registry.register(name, asValue(mock, opts));
		this.activeMocks[name] = true;
	}

	mockAsClass(name, mock, opts) {
		const asClass = this.registry.resolve('asClass');
		this.registry.register(name, asClass(mock, opts));
		this.activeMocks[name] = true;
	}

	mockAsFunction(name, mock, opts) {
		const asFunction = this.registry.resolve('asFunction');
		this.registry.register(name, asFunction(mock, opts));
		this.activeMocks[name] = true;
	}

	resetMocks() {
		this._.each(this.activeMocks, (nada, name) => {
			this.restore(name);
		});
	}

	restore(name) {
		const orginal = this.mappings()[name];
		this.registry.register(name, orginal);
		delete this.activeMocks[name];
	}

	mappings() {
		return this.registry.resolve('mappings');
	}
}

module.exports = MocksService;
