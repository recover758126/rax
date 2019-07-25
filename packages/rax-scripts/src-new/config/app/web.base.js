const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const getWebpackBase = require('../getWebpackBase');

module.exports = (context) => {
  const config = getWebpackBase(context);

  const { rootDir } = context;

  config.target('web');

  config.entry('index')
    .add('app.js');

  config.output
    .filename('[name].js')
    .publicPath('/');

  config
    .plugin('html')
    .use(HtmlWebpackPlugin, {
      inject: true,
      template: path.resolve(rootDir, 'index.html'),
    });

  return config;
};
