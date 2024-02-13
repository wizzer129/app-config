const { registry, path, fs, fsMock, rMock } = global.__helpers;

let config;
const configPath = path.resolve(__dirname, '..', 'config');
const nodeModules = path.resolve(__dirname, '..', 'node_modules');
const packageJson = path.resolve(__dirname, '..', 'package.json');
const ConfigFactoryPath = path.resolve(__dirname, '..', '..', 'src', 'factory', 'ConfigFactory.js');

describe('ConfigFactory', () => {
	beforeEach((done) => {
		const configFSMocks = {};
		const defaultJS = {
			github: {
				user: 'blue-white-robot',
			},
			base: 'default',
		};
		const testJS = {
			github: {
				pass: 'somepass',
			},
			another: 'here',
			base: 'override',
		};

		configFSMocks[configPath] = {
			'default.js': defaultJS,
			'test.js': testJS,
		};
		configFSMocks[nodeModules] = {
			'default.js': defaultJS,
		};
		configFSMocks[packageJson] = Buffer.from([8, 6, 7, 5, 3, 0, 9]);
		configFSMocks[ConfigFactoryPath] = fs.readFileSync(ConfigFactoryPath);

		// Mock file system
		fsMock(configFSMocks);

		// Mock requires
		rMock(path.resolve(configPath, 'default.js'), defaultJS);
		rMock(path.resolve(configPath, 'test.js'), testJS);

		try {
			config = registry.resolve('ConfigFactory')(__filename);
		} catch (e) {
			done.fail(e);
		}
		done();
	});

	afterEach(() => {
		fsMock.restore();
		rMock.stopAll();
	});

	it('Correct Methods', () => {
		expect(typeof config.has).toBe('function');
		expect(typeof config.get).toBe('function');
	});

	it('Verify Config Values', () => {
		expect(config.has('asdfasf')).toBe(false);
		expect(config.has('github')).toBe(true);
		expect(config.has('base')).toBe(true);
		expect(config.has('another')).toBe(true);
		expect(config.get('github.user')).toBe('blue-white-robot');
		expect(config.get('github.pass')).toBe('somepass');
		expect(config.get('base')).toBe('override');
	});

	it('Verify Config.all()', () => {
		expect(config.all()).toEqual({
			github: { user: 'blue-white-robot', pass: 'somepass' },
			base: 'override',
			another: 'here',
		});
	});
});
