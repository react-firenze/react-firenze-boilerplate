const path = require('path');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');
const nodeExternals = require('webpack-node-externals');

module.exports = (PATHS) =>
  merge([
    {
      entry: path.join(PATHS.server, '/server.js'),
      target: 'node',
      devtool: false,
      output: {
        path: PATHS.dist,
        filename: 'server.js',
      },
      externals: [nodeExternals()],
    },
    parts.limitChunks(1),
    parts.setEnvVariables({
      NODE_ENV: JSON.stringify('server'),
      PORT: JSON.stringify(process.env.PORT),
      MY_ENV_VAR: JSON.stringify(process.env.MY_ENV_VAR),
    }),
    parts.transpileJavaScript({
      presets: [['@babel/env', { targets: { node: 'current' } }]],
    }),
    parts.loadImages({
      name: '[name].[hash:8].[ext]',
      publicPath: '/images/',
      emitFile: false,
    }),
  ]);
