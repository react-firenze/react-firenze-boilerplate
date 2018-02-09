const path = require('path');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');
const webpack = require('webpack');

module.exports = (PATHS) => merge([
  {
    entry: PATHS.client,
    devtool: false,
    output: {
      path: path.join(PATHS.public, '/js/'),
      filename: 'bundle.[hash:8].js',
      publicPath: '/js/',
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
    ],
  },
  parts.loadHtmlTemplate({
    filename: path.join(PATHS.public, '/index.html'),
    template: path.join(PATHS.app, '/index.html'),
    appId: 'app',
    injectStyle: true,
  }),
  parts.setEnvVariables({
    NODE_ENV: JSON.stringify('production'),
    MY_ENV_VAR: JSON.stringify(process.env.MY_ENV_VAR),
  }),
  parts.clean(PATHS.public),
  parts.extractBundles([
    {
      name: 'commons',
      filename: 'commons.js',
      minChunks: ({ resource }) => (
        resource
        && resource.indexOf('node_modules') >= 0
        && resource.match(/\.js$/)
      ),
    },
    {
      name: 'manifest',
      filename: 'manifest.js',
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
