const { mocks, path, registry, fsMock, rMock } = global.__helpers;

const configPath = path.resolve(__dirname, '..', 'config');
const nodeModules = path.resolve(__dirname, '..', 'node_modules');
const packageJson = path.resolve(__dirname, '..', 'package.json');

describe('MocksService', () => {
	beforeEach(() => {
		const configFSMocks = {};
		const defaultJS = {
			github: {
				user: 'blue-white-robot',
			},
		};

		configFSMocks[configPath] = {
			'default.js': defaultJS,
		};
		configFSMocks[nodeModules] = {};
		configFSMocks[packageJson] = Buffer.from([8, 6, 7, 5, 3, 0, 9]);

		fsMock(configFSMocks);
		rMock(path.resolve(configPath, 'default.js'), defaultJS);
	});

	afterEach(() => {
		fsMock.restore();
		rMock.stopAll();
	});

	it('can mock a thing', () => {
		mocks.mock('ConfigFactory', {
			has() {
				return false;
			},
			get() {
				return 'nope';
			},
		});

		const config = registry.resolve('ConfigFactory');

		expect(typeof config.has).toBe('function');
		expect(typeof config.get).toBe('function');
		expect(config.has('asdfasf')).toBe(false);
		expect(config.has('github')).toBe(false);
		expect(config.get('github.user')).toBe('nope');
		expect(config.get('github.user')).toBe('nope');
	});

	it('can restore a mock', () => {
		let config;
		mocks.mock('ConfigFactory', {
			has() {
				return false;
			},
			get() {
				return 'nope';
			},
		});

		config = registry.resolve('ConfigFactory');

		expect(typeof config.has).toBe('function');
		expect(typeof config.get).toBe('function');
		expect(config.has('asdfasf')).toBe(false);
		expect(config.has('github')).toBe(false);
		expect(config.get('github.user')).toBe('nope');
		expect(config.get('github.user')).toBe('nope');

		mocks.resetMocks();

		config = registry.resolve('ConfigFactory')(__filename);

		expect(typeof config.has).toBe('function');
		expect(typeof config.get).toBe('function');
		expect(config.has('asdfasf')).toBe(false);
		expect(config.has('github')).toBe(true);
		expect(config.get('github.user')).toBe('blue-white-robot');
		expect(config.get('github.user')).toBe('blue-white-robot');
	});

	it('can mock a class', () => {
		let config;
		class MockConfigFactory {
			constructor({ _ }) {
				this._ = _;
			}

			has() {
				return false;
			}

			get() {
				return 'nope';
			}
		}

		mocks.mockAsClass('ConfigFactory', MockConfigFactory);

		config = registry.resolve('ConfigFactory');

		expect(typeof config.has).toBe('function');
		expect(typeof config.get).toBe('function');
		expect(config.has('asdfasf')).toBe(false);
		expect(config.has('github')).toBe(false);
		expect(config.get('github.user')).toBe('nope');
		expect(config.get('github.user')).toBe('nope');

		mocks.resetMocks();

		config = registry.resolve('ConfigFactory')(__filename);

		expect(typeof config.has).toBe('function');
		expect(typeof config.get).toBe('function');
		expect(config.has('asdfasf')).toBe(false);
		expect(config.has('github')).toBe(true);
		expect(config.get('github.user')).toBe('blue-white-robot');
		expect(config.get('github.user')).toBe('blue-white-robot');
	});
});
