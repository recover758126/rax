const autoBind = require('auto-bind');

module.exports = class GulpConfig {
  constructor(tasks, gulp) {
    autoBind(this);

    this.gulp = gulp;
    this.tasks = tasks;
  }

  toConfig() {
    return this.tasks;
  }
};
