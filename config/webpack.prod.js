const merge = require('webpack-merge');
const parts = require('./webpack.parts');
const webpack = require('webpack');

module.exports = (PATHS) => merge([
  {
    entry: PATHS.client,
    devtool: false,
    output: {
      path: PATHS.public,
      filename: 'js/bundle.[hash:8].js',
      publicPath: '',
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
    ],
  },
  parts.loadHtmlTemplate({
    filename: '../public/index.html',
    template: '../src/index.html',
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
      name: 'vendor',
      filename: 'js/vendor.js',
      minChunks: ({ resource }) => (
        resource
        && resource.indexOf('node_modules') >= 0
        && resource.match(/\.js$/)
      ),
    },
    {
      name: 'common',
      filename: 'js/common.js',
      minChunks: ({ resource }) => (
        resource
        && resource.indexOf('react') >= 0
        && resource.match(/\.js$/)
      ),
    },
    {
      name: 'manifest',
      filename: 'js/manifest.js',
      minChunks: Infinity,
    },
  ]),
  parts.transpileJavaScript(),
  parts.loadImages({
    name: 'images/[name].[hash:8].[ext]',
    output: '/public/',
    publicPath: '../',
  }),
  parts.minifyJavascript(),
]);
