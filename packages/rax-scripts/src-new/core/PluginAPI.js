const _ = require('lodash');
const log = require('../utils/log');

const USER_OPT = [
  'command',
  'commandArgs',
  'target',
  'rootDir',
  'userConfig',
  'appConfig',
  'pkg'
];

module.exports = class PluginAPI {
  constructor(context, pluginName) {
    this.pluginName = pluginName;
    // pick public property
    this.context = _.pick(context, USER_OPT);
    this.log = log;

    this.chainWebpack = this.chainWebpack.bind(this, context.chainWebpackFns);
    this.onHook = this.onHook.bind(this, context.eventHooks);
  }

  chainWebpack(chainWebpackFns, fn) {
    chainWebpackFns.push({
      pluginName: this.pluginName,
      fn
    });
  }

  onHook(eventHooks, key, fn) {
    if (!Array.isArray(eventHooks[key])) {
      eventHooks[key] = [];
    }
    eventHooks[key].push(fn);
  }
};
