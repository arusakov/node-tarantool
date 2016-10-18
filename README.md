node-tarantool (work in progress)
=================================
[![Build Status](https://travis-ci.org/arusakov/node-tarantool.svg?branch=master)](https://travis-ci.org/arusakov/node-tarantool)
[![codecov](https://codecov.io/gh/arusakov/node-tarantool/branch/master/graph/badge.svg)](https://codecov.io/gh/arusakov/node-tarantool)
[![Known Vulnerabilities](https://snyk.io/test/github/arusakov/node-tarantool/badge.svg)](https://snyk.io/test/github/arusakov/node-tarantool)

Tarantool v1.6+ driver for Node.js written in TypeScript

Dependencies
------------
* Node.js (v6+) and npm (v3+)
* Tarantool (v1.6+)

Development
-----------
**First steps**
* run `npm install` in project root
* see `scripts` in `package.json`

**Main commands**
* `tarantool dbtest.lua` - run tarantool with simple setup script
* `npm run test-ci` - run unit tests in watch mode
* `npm run coverage` - code coverage in text format in terminal
* `npm run coverage-html` - code coverage in html format in `coverage` folder
