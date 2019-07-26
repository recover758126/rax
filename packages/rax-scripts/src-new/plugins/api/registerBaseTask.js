const fs = require('fs-extra');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');

const filePattern = require('./filePattern');
const babelConfig = require('../../config/babel.config');

const {
  JS_FILES_PATTERN,
  TS_FILES_PATTERN,
  OTHER_FILES_PATTERN,
  IGNORE_PATTERN
} = filePattern;

module.exports = (context, log, gulp) => {
  const { userConfig } = context;
  const { outputDir } = userConfig;

  gulp.task('__compileJs', () => {
    log.info('编译JS文件');
    return gulp
      .src(JS_FILES_PATTERN, { ignore: IGNORE_PATTERN })
      .pipe(babel(babelConfig))
      .pipe(gulp.dest(outputDir))
      .on('end', () => {
        log.info('编译JS文件完成');
      });
  });

  gulp.task('__compileTs', () => {
    log.info('编译TS文件');
    return gulp
      .src(TS_FILES_PATTERN, { ignore: IGNORE_PATTERN })
      .pipe(ts())
      .on('error', (err) => {
        throw err;
      })
      .pipe(gulp.dest(outputDir))
      .on('end', () => {
        log.info('编译TS文件完成');
      });
  });

  gulp.task('__copyOtherFile', () => {
    log.info('复制非JS/TS文件');
    return gulp
      .src(OTHER_FILES_PATTERN, { ignore: IGNORE_PATTERN })
      .pipe(gulp.dest(outputDir))
      .on('end', () => {
        log.info('复制非JS/TS文件完成');
      });
  });
};
