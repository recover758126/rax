const fs = require('fs-extra');
const chalk = require('chalk');

const Context = require('../../core/Context');

module.exports = async function({
  args,
  custom,
  rootDir,
}) {
  const context = new Context({
    args,
    command: 'build',
    custom,
    rootDir,
  });

  const { userConfig, applyHook } = context;
  const { type, targets, outputDir } = userConfig;

  // clean build
  fs.removeSync(outputDir);

  await applyHook('beforeBuild');

  if (type === 'app') {
    for (const target of targets) {
      const config = await context.getConfig(target);

      console.log(config);
    }
  }

  if (type === 'api') {
    const config = await context.getConfig();
  }

  await applyHook('afterBuild');
};
