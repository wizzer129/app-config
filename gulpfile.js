
const gulp = require('gulp');
const path = require('path');
const { spawn } = require('child_process');

const jasmineSpawn = () => {
	const jasmineExec = path.resolve('specs', 'jasmine-runner.js');
	const env = Object.create(process.env);
	env.NODE_ENV = 'test';
	const jas = spawn('node', [jasmineExec], { stdio: 'inherit', env });
	return jas;
};

const watchTest = () => {
	gulp.watch([
		'src/**/*.js',
		'specs/**/*.js',
		'config/*.*',
	], { name: 'test', read: false, delay: 100 }, jasmineSpawn);
};

// gulp test
const test = gulp.series(jasmineSpawn, watchTest);
test.description = 'Run tests and start watching if they succeed';
gulp.task('test', test);


// gulp jasmine:test
gulp.task('jasmine:test', jasmineSpawn);
