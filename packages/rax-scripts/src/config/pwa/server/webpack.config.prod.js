'use strict';

const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('./webpack.config.base');

const webpackConfigProd = webpackMerge(webpackConfigBase, {
  devtool: 'source-map',
});

module.exports = webpackConfigProd;
