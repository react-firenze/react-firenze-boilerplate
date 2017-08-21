const path = require('path');
const merge = require('webpack-merge');
const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');
const serverConfig = require('./webpack.server');

require('dotenv').config()

const PATHS = {
  app: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  client: path.join(__dirname, '../src/client/ClientApp.jsx'),
  public: path.join(__dirname, '../public'),
  server: path.join(__dirname, '../src/server/server.js')
};

const commonConfig = {
  context: __dirname,
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: true
  },
  bail: true,
}

module.exports = () => {
  if (process.env.NODE_ENV === 'production') {
    return merge(commonConfig, prodConfig(PATHS));
  } else if (process.env.NODE_ENV === 'server') {
    return merge(commonConfig, serverConfig(PATHS));
  }

  return merge(commonConfig, devConfig(PATHS));
};
