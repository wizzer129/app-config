# NANO-Config : Simple Config Management 

Dead simple config management: `config/default.js` with optional an override determined via `NODE_ENV`.

## Motivation

NANO-Config is design to be an interface compatible replacement for https://www.npmjs.com/package/config **BUT** does provide a different config file location algorithm.

A required `config/default.js` and an optional override file determined via the current processes `NODE_ENV`. eg: `config/production.js` The resulting config objects are merged via https://lodash.com/docs/4.17.10#merge.

Once the config objects are parsed, the configuration is immutable.

The `config` folder is found by traversing up the directory tree from the include point looking for the closest path containing a `package.json`, `node_modules` directory and `config` directory. This lookup algorithm allows NANO-Config to be used as a dependency in a `node_module` isolated from the running applications configuration.

## Installation 

```
npm install --save git@github.com:blue-white-inc/nano-config.git
```

## Usage

Setup a `/config` directory in the root of your code base. Include a `default.js` file:

```
module.exports = {
	some: {
		value: 'test'
	}
};
```

```
const { config } = require('nano-config');

config.has('some.value'); // true
config.get('some.value'); // test
config.all('some.value'); // { some: { value: 'test' } }
```

## Development 

### Toolchain
- Code is written in Javascript
- NodeJS 8.9.3

### Installation

- Install [NodeJs 8.9.3](https://nodejs.org/en/)
- Clone/Checkout this repository
- From command line tool (eg. Git Bash, Command Prompt, Windows Powershell, etc..), execute the following:
```
npm install
npm install gulp@next -g
```

## Running tests

Note: the newer versions of Jasmine and  gulp have some strange interactions. We are running slightly older versions that seem to behave sanely.

```
"gulp": "4.0.0",
"jasmine": "3.1.0",
"jasmine-supertest": "1.0.0",
```

```bash
$ gulp test
```

## Code Style

Code style is enforced via `eslint` with rules defined in `.eslintrc.json`. `eslint` has the ability to resolve some style issues automatically.

```bash
$ npm run lint
$ npm run lint:fix
```
