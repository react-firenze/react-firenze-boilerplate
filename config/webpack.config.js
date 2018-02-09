const path = require('path');
const merge = require('webpack-merge');
const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');
const serverConfig = require('./webpack.server');

require('dotenv').config();

const PATHS = {
  app: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  client: path.join(__dirname, '../src/ClientApp.js'),
  public: path.join(__dirname, '../public'),
  server: path.join(__dirname, '../server/server.js'),
};

const commonConfig = {
  context: __dirname,
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      actions: path.resolve(__dirname, '../src/actions'),
      constants: path.resolve(__dirname, '../src/constants'),
      components: path.resolve(__dirname, '../src/components'),
      containers: path.resolve(__dirname, '../src/containers'),
      images: path.resolve(__dirname, '../assets/images'),
      utils: path.resolve(__dirname, '../src/utils'),
    },
  },
  stats: {
    colors: true,
    reasons: false,
    chunks: false,
    hash: false,
    modules: false,
  },
  bail: true,
};

module.exports = () => {
  if (process.env.NODE_ENV === 'production') {
    return merge(commonConfig, prodConfig(PATHS));
  } else if (process.env.NODE_ENV === 'server') {
    return merge(commonConfig, serverConfig(PATHS));
  }

  return merge(commonConfig, devConfig(PATHS));
};
