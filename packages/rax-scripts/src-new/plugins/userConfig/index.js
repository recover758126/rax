const _ = require('lodash');
const chalk = require('chalk');
const log = require('../../utils/log');

const supportConfig = [
  'outputDir'
];

module.exports = (api) => {
  const { userConfig = {} } = api.context;

  _.forEach(userConfig, (value, key) => {
    if (_.includes(key)) {
      try {
        // load config plugin
        const configPlugin = require(`./configs/${key}`);
        configPlugin(api, value);
      } catch (e) {
        log.error(e);
        log.error(`Config '${chalk.bold(key)}' is not found`);
      }
    }
  });
};
