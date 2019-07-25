#!/usr/bin/env node
'use strict';
const program = require('commander');
const packageInfo = require('../package.json');

program
  .version(packageInfo.version)
  .usage('<command> [options]')
  .command('build', 'Build project in production mode')
  .command('dev', 'Develop project with reload')
  .command('lint', 'Lint for source  (only support component now)')
  .command('test', 'Testing use jest(only support component now)')
  .parse(process.argv);
