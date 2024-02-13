/* eslint-disable global-require, import/no-extraneous-dependencies, no-console */
const runJasmine = async () => {
	const Jasmine = require('jasmine');
	const jasmine = new Jasmine();

	// Setup console reporter
	const JasmineConsoleReporter = require('jasmine-console-reporter');
	const reporter = new JasmineConsoleReporter({
		colors: 1, // (0|false)|(1|true)|2
		cleanStack: 3, // (0|false)|(1|true)|2|3
		verbosity: 4, // (0|false)|1|2|(3|true)|4
		listStyle: 'indent', // "flat"|"indent"
		activity: true,
		emoji: true, // boolean or emoji-map object
		beep: true,
	});

	jasmine.loadConfig({
		spec_files: [
			'specs/**/*spec.js',
		],
		helpers: [
			'specs/helper.js',
		],
		verbose: true,
		stopSpecOnExpectationFailure: false,
		random: false,
	});

	// initialize and execute
	jasmine.env.clearReporters();
	jasmine.addReporter(reporter);
	jasmine.exitOnCompletion = false;
	const result = await jasmine.execute();
	if (result.overallStatus === 'passed') {
		console.log('All specs have passed');
	} else {
		console.log('At least one spec has failed');
	}
};

runJasmine()
	.then(() => {
		process.exit(0);
	})
	.catch((err) => {
		console.log(err);
		process.exit(1);
	});
