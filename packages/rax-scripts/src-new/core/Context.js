const _ = require('lodash');
const path = require('path');
const autoBind = require('auto-bind');
const fs = require('fs-extra');
const deepmerge = require('deepmerge');

const log = require('../utils/log');
const PluginAPI = require('./PluginAPI');
const defaultUserConfig = require('../config/userConfig.default');
const getDefaultConfig = require('../config/getDefaultConfig');

const APP_CONFIG_FILE = 'app.json';
const USER_CONFIG_FILE = 'build.json';

module.exports = class Context {
  constructor({
    command,
    custom = {},
    rootDir = process.cwd(),
    args = {} }
  ) {
    autoBind(this);

    this.command = command;
    this.commandArgs = args;
    this.rootDir = rootDir;

    // app.json
    this.appConfig = this.getAppConfig();

    this.customConfig = custom;
    this.userConfig = this.getUserConfig(custom);
    this.plugins = this.getPlugins(custom);
  }

  getAppConfig() {
    const configPath = path.resolve(this.rootDir, APP_CONFIG_FILE);

    let appConfig = {};
    if (fs.existsSync(configPath)) {
      try {
        appConfig = fs.readJsonSync(configPath);
      } catch (err) {
        console.error(`Fail to load app config file ${configPath}`);
        console.error(err);
        process.exit(1);
      }
    }

    return appConfig;
  }

  getUserConfig(custom) {
    const { config } = this.commandArgs;
    let configPath = '';
    if (config) {
      configPath = path.isAbsolute(config) ? config : path.resolve(this.rootDir, config);
    } else {
      configPath = path.resolve(this.rootDir, USER_CONFIG_FILE);
    }
    let userConfig = {};
    if (fs.existsSync(configPath)) {
      try {
        userConfig = fs.readJsonSync(configPath);
      } catch (err) {
        console.error(`Fail to load config file ${configPath}, use default config instead`);
        console.error(err);
        process.exit(1);
      }
    }

    let mergedConfig = defaultUserConfig;

    if (custom.config) {
      mergedConfig = deepmerge(mergedConfig, custom.config, {
        // not merge plugins
        customMerge: (key) => {
          if (key === 'plugins') {
            return (a) => a;
          }
        }
      });
    }

    mergedConfig = deepmerge(mergedConfig, userConfig);

    return mergedConfig;
  }

  getPlugins(custom) {
    const builtInPlugins = [
      '../plugins/userConfig',
    ].map((pluginPath) => {
      return {
        fn: require(pluginPath)
      };
    });

    let customPlugins = [];
    if (custom.config && custom.config.plugins) {
      customPlugins = custom.config.plugins.map((pluginInfo) => {
        return readPlugin(pluginInfo, custom.root);
      });
    }

    const userPlugins = this.userConfig.plugins.map((pluginInfo) => {
      return readPlugin(pluginInfo, this.rootDir);
    });

    return _.concat(builtInPlugins, customPlugins, userPlugins);
  }

  async runPlugins(config) {
    for (const pluginInfo of this.plugins) {
      const { fn, options } = pluginInfo;
      await fn(new PluginAPI(this, config), options);
    }
  }

  async getConfig(target) {
    this.target = target;
    const { type } = this.userConfig;
    const config = getDefaultConfig({
      type,
      command: this.command,
      target,
      context: this
    });
    await this.runPlugins(config);

    return config;
  }
};

function readPlugin(pluginInfo, rootPath) {
  let fn = () => {};

  if (!Array.isArray(pluginInfo)) {
    pluginInfo = [pluginInfo];
  };

  const pluginPath = pluginInfo[0];
  const options = pluginInfo[1];

  try {
    fn = require(require.resolve(pluginPath, { paths: [rootPath] }));
  } catch (err) {
    log.error(`Fail to load plugin ${pluginPath}`);
    console.error(err);
    process.exit(1);
  }

  return {
    fn,
    options
  };
}
