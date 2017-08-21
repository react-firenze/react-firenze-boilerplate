/* eslint import/no-extraneous-dependencies: 0 */
const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const NyanProgressPlugin = require('nyan-progress-webpack-plugin');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');

module.exports = (PATHS) => merge([
  {
    devtool: 'cheap-eval-source-map',
    output: {
      path: path.join(__dirname, 'js'),
      filename: 'bundle.js',
      publicPath: '/js/'
    },
    plugins: [
      new FriendlyErrorsWebpackPlugin(),
      new NyanProgressPlugin(),
      new webpack.NamedModulesPlugin()
    ]
  },
  parts.clean(PATHS.public),
  parts.loadHtmlTemplate({
    filename: '../../public/index.html',
    template: '../src/index.html',
    appId: 'app',
  }),
  parts.setEnvVariables({
    MY_ENV_VAR: JSON.stringify(process.env.MY_ENV_VAR),
  }),
  parts.hotModuleRelaod({
    host: 'localhost',
    port: 8080,
    entry: PATHS.client,
  }),
  parts.devServer({
    host: 'localhost',
    port: 8080,
    publicPath: '/js/',
    contentBase: './public'
  }),
  parts.lintJavaScript({
    include: PATHS.app,
  }),
  parts.transpileJavaScript(),
  parts.inlineImages({
    name: 'images/[name].[ext]',
    output: '/public/',
    publicPath: '../',
  }),
])
