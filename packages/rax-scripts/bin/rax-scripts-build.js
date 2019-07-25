#!/usr/bin/env node
'use strict';
const program = require('commander');
const build = require('../src-new/commands/buildScript');

program
  .option('--config <config>', 'use custom config')
  .action((cmd) => {
    build({
      args: {
        config: cmd.config
      }
    });
  })
  .parse(process.argv);

// program
//   .option('--type <type>', 'set application type', 'webapp')
//   .option('--dir <dir>', 'set project path')
//   .option('--debug', 'enabled debug mode', false)
//   .option('--target <target>', 'set project path')
//   .option('--public-path <publicPath>', 'set bundle assets public path end with `/`', '/')
//   .option('--output-path <outputPath>', 'set output path', 'build')
//   .option('--analyzer', 'enabled webpack bundle analyzer', false)
//   .action((cmd) => {
//     optionsAttachToEnv(cmd);
//     build(program.type);
//   });

// program.parse(process.argv);
