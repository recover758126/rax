const fs = require('fs-extra');
const chalk = require('chalk');

const Context = require('../../core/Context');

const apiDev = require('./apiDev');

module.exports = async function(args) {
  const context = new Context({
    args,
    command: 'dev',
  });

  const { userConfig } = context;
  const { type, targets } = userConfig;

  if (type === 'app') {
    for (const target of targets) {
      const config = await context.getConfig(target);

      console.log(config);
    }
  }

  if (type === 'api') {
    const config = await context.getConfig();
    apiDev(config);
  }
};
