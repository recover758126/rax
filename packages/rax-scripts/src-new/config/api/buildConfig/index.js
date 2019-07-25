const gulp = require('gulp');

const registerBaseTask = require('../registerBaseTask');
const GulpConfig = require('../../GulpConfig');

module.exports = (context) => {
  registerBaseTask(gulp, context);

  const tasks = [
    '__clean',
    [
      '__compileJs',
      '__compileTs',
      '__copyOtherFile'
    ],
  ];

  return new GulpConfig(tasks, gulp);
};
