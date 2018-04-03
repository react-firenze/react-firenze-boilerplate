const path = require('path');
const merge = require('webpack-merge');
const {
  ReactLoadablePlugin,
} = require('@react-firenze/react-loadable/webpack');
const parts = require('./webpack.parts');
const webpack = require('webpack');

const VENDORS_CHUNK = 'commons';
const MANIFEST_CHUNK = 'manifest';
const MAIN_CHUNK = 'main';

module.exports = (PATHS, TITLE) =>
  merge([
    {
      entry: path.join(PATHS.client, '/ClientApp.js'),
      devtool: false,
      output: {
        path: path.join(PATHS.public, '/js/'),
        filename: `${MAIN_CHUNK}.js`,
        chunkFilename: '[name].[chunkhash].js',
        publicPath: '/js/',
      },
      plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new ReactLoadablePlugin({
          filename: path.join(PATHS.server, '/react-loadable.json'),
        }),
      ],
    },
    parts.loadHtmlTemplate({
      filename: path.join(PATHS.public, '/index.html'),
      template: path.join(PATHS.app, '/index.html'),
      vendorsChunkFilename: VENDORS_CHUNK,
      manifestChunkFilename: MANIFEST_CHUNK,
      mainChunkFilename: MAIN_CHUNK,
      appId: 'app',
      title: TITLE,
      injectStyle: true,
      injectState: true,
      injectChunkBundles: true,
    }),
    parts.setEnvVariables({
      NODE_ENV: JSON.stringify('production'),
      MY_ENV_VAR: JSON.stringify(process.env.MY_ENV_VAR),
    }),
    parts.clean(PATHS.public),
    parts.extractBundles([
      {
        name: VENDORS_CHUNK,
        filename: `${VENDORS_CHUNK}.js`,
        minChunks: ({ resource }) =>
          resource
          && resource.indexOf('node_modules') >= 0
          && resource.match(/\.js$/),
      },
      {
        name: MANIFEST_CHUNK,
        filename: `${MANIFEST_CHUNK}.js`,
        minChunks: Infinity,
      },
    ]),
    parts.transpileJavaScript(),
    parts.loadImages({
      name: '[name].[hash:8].[ext]',
      outputPath: '../images/',
      publicPath: '/images/',
    }),
    parts.minifyJavascript(),
  ]);
