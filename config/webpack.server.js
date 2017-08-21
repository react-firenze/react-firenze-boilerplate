const merge = require('webpack-merge');
const parts = require('./webpack.parts');

module.exports = (PATHS) => merge([
  {
    entry: PATHS.server,
    target: 'node',
    output: {
      path: PATHS.dist,
      filename: 'server.js',
      publicPath: '',
      libraryTarget: 'umd'
    },
    externals:  /^[a-z\-0-9]+$/,
    devtool: false,
    plugins: [],
  },
  parts.setEnvVariables({
    NODE_ENV: JSON.stringify('server'),
    MY_ENV_VAR: JSON.stringify(process.env.MY_ENV_VAR),
  }),
  parts.clean(PATHS.dist),
  parts.lintJavaScript({
    include: PATHS.app,
  }),
  parts.transpileJavaScript({
    presets: [
      ['env', {
        'targets': {
          'node': 'current'
        }
      }]
    ]
  }),
  parts.loadImages({
    name: '[name].[ext]',
    output: '',
    publicPath: '/images/',
    emitFile: false,
  }),
]);
