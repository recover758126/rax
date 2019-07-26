const _ = require('lodash');
const path = require('path');
const autoBind = require('auto-bind');
const fs = require('fs-extra');
const deepmerge = require('deepmerge');

const log = require('../utils/log');
const PluginAPI = require('./PluginAPI');
const defaultUserConfig = require('../config/userConfig.default');
const getDefaultConfig = require('../config/getDefaultConfig');

const PKG_FILE = 'package.json';
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

    this.chainWebpackFns = [];
    this.eventHooks = {};
    this.customConfig = custom;

    this.userConfig = this.getUserConfig(custom);
    // get project normal config
    this.appConfig = this.getProjectConfig(APP_CONFIG_FILE);
    this.pkg = this.getProjectConfig(PKG_FILE);

    this.plugins = this.getPlugins(custom);
  }

  getProjectConfig(fileName) {
    const configPath = path.resolve(this.rootDir, fileName);

    let config = {};
    if (fs.existsSync(configPath)) {
      try {
        config = fs.readJsonSync(configPath);
      } catch (err) {
        log.info('CONFIG', `Fail to load config file ${configPath}, use default`);
      }
    }

    return config;
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
        log.info('CONFIG', `Fail to load config file ${configPath}, use default config instead`);
        log.error(err);
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
      '../plugins/api',
    ].map((pluginPath) => {
      return {
        name: pluginPath,
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

  async applyHook(key, opts = {}) {
    const hooks = this.eventHooks[key] || [];

    for (const fn of hooks) {
      await fn(opts);
    }
  }

  async runPlugins() {
    for (const pluginInfo of this.plugins) {
      const { fn, options } = pluginInfo;
      await fn(new PluginAPI(this));
    }
  }

  async runChainWebpack(config) {
    for (const fn of this.chainWebpackFns) {
      if (_.isFunction(fn)) {
        const res = await fn(config);
        if (!_.isUndefined(res)) {
          this.config = res;
        }
      }
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
    await this.runPlugins();
    await this.runChainWebpack(config);

    return config;
  }
};

function readPlugin(pluginInfo, rootPath) {
  let fn = () => {};

  if (!Array.isArray(pluginInfo)) {
    pluginInfo = [pluginInfo];
  };

  const pluginPath = require.resolve(pluginInfo[0], { paths: [rootPath] });
  const options = pluginInfo[1];

  try {
    fn = require(pluginPath);
  } catch (err) {
    log.error(`Fail to load plugin ${pluginPath}`);
    log.error(err);
    process.exit(1);
  }

  return {
    name: pluginPath,
    fn,
    options
  };
}
