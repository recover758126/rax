const _ = require('lodash');
const path = require('path');
const fs = require('fs-extra');
const deepmerge = require('deepmerge');

const log = require('../utils/log');
const PluginAPI = require('./PluginAPI');
const defaultUserConfig = require('../config/userConfig.default');
const getDefaultConfig = require('../config/getDefaultConfig');

const APP_CONFIG_FILE = 'app.json';
const USER_CONFIG_FILE = 'build.json';

module.exports = class Context {
  constructor({ command, rootDir = process.cwd(), args = {} }) {
    this.command = command;
    this.commandArgs = args;
    this.rootDir = rootDir;

    // app.json
    this.appConfig = this.getAppConfig();

    this.userConfig = this.getUserConfig();
    this.plugins = this.getPlugins();
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

  getUserConfig() {
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

    const mergedConfig = deepmerge(defaultUserConfig, userConfig);

    return mergedConfig;
  }

  getPlugins() {
    const builtInPlugins = [
      '../plugins/userConfig',
    ].map((pluginPath) => {
      return {
        fn: require(pluginPath)
      };
    });

    const userPlugins = this.userConfig.plugins.map((pluginInfo) => {
      let fn = () => {};

      if (!Array.isArray(pluginInfo)) {
        pluginInfo = [pluginInfo];
      };

      const pluginPath = pluginInfo[0];
      const options = pluginInfo[1];

      try {
        fn = require(require.resolve(pluginPath, { paths: [this.rootDir] }));
      } catch (err) {
        log.error(`Fail to load plugin ${pluginPath}`);
        console.error(err);
        process.exit(1);
      }

      return {
        fn,
        options
      };
    });

    return _.concat(builtInPlugins, userPlugins);
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
