const Chain = require('webpack-chain');

module.exports = (context) => {
  const chainConfig = new Chain();

  const { rootDir, command } = context;
  let mode = 'none';

  if (command === 'dev') {
    mode = 'development';
  }

  if (command === 'build') {
    mode = 'production';
  }

  chainConfig
    .mode(mode)
    .context(rootDir);

  return chainConfig;
};
