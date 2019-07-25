const path = require('path');
const chalk = require('chalk');

const gulp = require('gulp');
const runSequence = require('run-sequence').use(gulp);

const log = require('../../utils/log');

module.exports = (config) => {
  runSequence(...config.toConfig(), () => {
    log.info('Rax API', '开发服务已建立, 文件改动会实时更新');
  });
};
