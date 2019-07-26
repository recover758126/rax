const _ = require('lodash');
const gulp = require('gulp');
const chalk = require('chalk');
const runSequence = require('run-sequence').use(gulp);

const filePattern = require('./filePattern');
const registerBaseTask = require('./registerBaseTask');

const {
  JS_FILES_PATTERN,
  TS_FILES_PATTERN,
  OTHER_FILES_PATTERN,
  IGNORE_PATTERN
} = filePattern;

module.exports = ({ context, chainWebpack, log, onHook }) => {
  const { command } = context;

  onHook('afterBuild', () => {
    registerBaseTask(context, log, gulp);

    const tasks = [
      '__compileJs',
      '__compileTs',
      '__copyOtherFile'
    ];

    runSequence(tasks, () => {
      log.info('Rax API', '文件构建完成');
    });
  });

  onHook('afterDev', () => {
    registerBaseTask(context, log, gulp);

    gulp.watch(JS_FILES_PATTERN, { ignore: IGNORE_PATTERN }, ['__compileJs']);
    gulp.watch(TS_FILES_PATTERN, { ignore: IGNORE_PATTERN }, ['__compileTs']);
    gulp.watch(OTHER_FILES_PATTERN, { ignore: IGNORE_PATTERN }, ['__copyOtherFile']);

    const tasks = [
      '__compileJs',
      '__compileTs',
      '__copyOtherFile'
    ];

    runSequence(tasks, () => {
      log.info('Rax API', '开发服务器已建立');
    });
  });
};
