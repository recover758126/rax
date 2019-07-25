#!/usr/bin/env node
'use strict';
const program = require('commander');
const dev = require('../src-new/commands/devScript');

program
  .option('--config <config>', 'use custom config')
  .action((cmd) => {
    dev({
      config: cmd.config
    });
  })
  .parse(process.argv);

// const program = require('commander');
// const optionsAttachToEnv = require('../src/utils/optionsAttachToEnv');

// program
//   .option('--type <type>', 'set application type', 'webapp')
//   .option('-p, --port <port>', 'set server port', 9999)
//   .option('--host <host>', 'set server host')
//   .option('--dir <dir>', 'set project path')
//   .option('--https', 'enabled https protocol', false)
//   .option('--analyzer', 'enabled webpack bundle analyzer', false)
//   .action((cmd) => {
//     optionsAttachToEnv(cmd);
//     require('../src/start')(program.type);
//   });

// program.parse(process.argv);
