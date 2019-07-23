'use strict';
/* eslint no-console: 0 */
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs-extra');
const chalk = require('chalk');

const createWebpackCompiler = require('./utils/createWebpackCompiler');
const pathConfig = require('./config/path.config');
const componentCompiler = require('./utils/componentCompiler');
const jsx2mp = require('jsx2mp');

const { getWebpackConfig } = require('./config/');

const MINIAPP = 'miniapp';
const COMPONENT = 'component';

module.exports = function(type = 'webapp') {
  if (type === MINIAPP) {
    jsx2mp(pathConfig.appDirectory, pathConfig.appDist, {
      enableWatch: false,
      type: 'project',
      dist: 'dist',
      entry: pathConfig.universalAppEntry,
    });
  } else if (type === COMPONENT) { // build component
    fs.removeSync(pathConfig.appDist);
    componentCompiler();
  } else { // build app
    fs.removeSync(pathConfig.appBuild);
    const config = getWebpackConfig(type);
    const compiler = createWebpackCompiler(config);

    compiler.run((err) => {
      if (err) {
        throw err;
      }

      console.log(chalk.green('\nBuild successfully.'));
      process.exit();
    });
  }
};
