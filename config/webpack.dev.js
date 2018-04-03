/* eslint import/no-extraneous-dependencies: 0 */
const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const NyanProgressPlugin = require('nyan-progress-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');

const PORT = 8080;
const HOST = 'localhost';

module.exports = (PATHS, TITLE) =>
  merge([
    {
      devtool: 'cheap-module-source-map',
      output: {
        path: path.join(__dirname, 'js'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/js/',
      },
      plugins: [
        new FriendlyErrorsWebpackPlugin(),
        new NyanProgressPlugin(),
        new webpack.NamedModulesPlugin(),
        new OpenBrowserPlugin({ url: `http://${HOST}:${PORT}` }),
      ],
    },
    parts.clean(PATHS.public),
    parts.loadHtmlTemplate({
      filename: path.join(PATHS.public, '/index.html'),
      template: path.join(PATHS.app, '/index.html'),
      appId: 'app',
      title: TITLE,
    }),
    parts.setEnvVariables({
      MY_ENV_VAR: JSON.stringify(process.env.MY_ENV_VAR),
    }),
    parts.hotModuleRelaod({
      host: HOST,
      port: PORT,
      entry: path.join(PATHS.client, '/ClientApp.js'),
    }),
    parts.devServer({
      contentBase: PATHS.public,
      publicPath: '/js/',
      host: HOST,
      port: PORT,
    }),
    parts.transpileJavaScript(),
    parts.inlineImages(),
  ]);
