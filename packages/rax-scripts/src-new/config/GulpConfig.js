module.exports = class GulpConfig {
  constructor(tasks, gulp) {
    this.gulp = gulp;
    this.tasks = tasks;
  }

  toConfig() {
    return this.tasks;
  }
};
