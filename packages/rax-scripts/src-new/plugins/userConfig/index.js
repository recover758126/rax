const _ = require('lodash');

const supportConfig = [
  'outputDir'
];

module.exports = (api) => {
  const { context, log } = api;
  const { userConfig } = context;

  _.forEach(userConfig, (value, key) => {
    if (_.includes(supportConfig, key)) {
      try {
        // load config plugin
        const configPlugin = require(`./configs/${key}`);
        configPlugin(api, value);
      } catch (e) {
        log.error(e);
        log.error(`Config file plugins/userConfig/configs/${key} load error`);
        process.exit(1);
      }
    }
  });
};
