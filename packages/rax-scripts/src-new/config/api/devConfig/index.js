const gulp = require('gulp');

const filePattern = require('../filePattern');
const registerBaseTask = require('../registerBaseTask');
const GulpConfig = require('../../GulpConfig');

const {
  JS_FILES_PATTERN,
  TS_FILES_PATTERN,
  OTHER_FILES_PATTERN,
  IGNORE_PATTERN
} = filePattern;

module.exports = (context) => {
  registerBaseTask(gulp, context);

  gulp.watch(JS_FILES_PATTERN, { ignore: IGNORE_PATTERN }, ['__compileJs']);
  gulp.watch(TS_FILES_PATTERN, { ignore: IGNORE_PATTERN }, ['__compileTs']);
  gulp.watch(OTHER_FILES_PATTERN, { ignore: IGNORE_PATTERN }, ['__copyOtherFile']);

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
