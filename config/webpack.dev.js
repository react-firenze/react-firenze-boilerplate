/* eslint import/no-extraneous-dependencies: 0 */
const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const NyanProgressPlugin = require('nyan-progress-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');

const PORT = 8080;

module.exports = (PATHS) => merge([
  {
    devtool: 'eval-source-map',
    output: {
      path: path.join(__dirname, 'js'),
      filename: 'bundle.js',
      publicPath: '/js/',
    },
    plugins: [
      new FriendlyErrorsWebpackPlugin(),
      new NyanProgressPlugin(),
      new webpack.NamedModulesPlugin(),
      new OpenBrowserPlugin({ url: `http://localhost:${PORT}` }),
    ],
  },
  parts.clean(PATHS.public),
  parts.loadHtmlTemplate({
    filename: '../../public/index.html',
    template: '../src/index.html',
    appId: 'app',
    injectStyle: false,
  }),
  parts.setEnvVariables({
    MY_ENV_VAR: JSON.stringify(process.env.MY_ENV_VAR),
  }),
  parts.hotModuleRelaod({
    host: 'localhost',
    port: PORT,
    entry: PATHS.client,
  }),
  parts.devServer({
    host: 'localhost',
    port: PORT,
    publicPath: '/js/',
    contentBase: './public',
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
]);
