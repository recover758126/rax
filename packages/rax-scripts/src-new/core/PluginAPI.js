const log = require('../utils/log');

module.exports = class PluginAPI {
  constructor(context, config) {
    this.context = context;
    this.log = log;
    this.onHook = this.onHook.bind(this);

    this.config = config;
  }

  onHook(key, fn) {
    if (!Array.isArray(this.context.eventHooks[key])) {
      this.context.eventHooks[key] = [];
    }
    this.context.eventHooks[key].push(fn);
  }
};
