const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const PORT = 8080;

exports.clean = (dest) => ({
  plugins: [
    new CleanWebpackPlugin([dest], {
      root: path.join(__dirname, '..'),
      verbose: true,
      dry: false,
    }),
  ],
});

exports.devServer = ({ host = 'localhost', port = PORT, publicPath, contentBase } = {}) => ({
  devServer: {
    hot: true,
    publicPath,
    historyApiFallback: true,
    contentBase,
    stats: 'errors-only',
    host,
    port,
    overlay: {
      errors: true,
      warnings: true,
    },
  },
});

exports.extractBundles = (bundles) => ({
  plugins: bundles.map(bundle => (
    new webpack.optimize.CommonsChunkPlugin(bundle)
  )),
});

exports.hotModuleRelaod = ({ host, port, entry }) => {
  const hmrEntry = [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://${host}:${port}`,
    'webpack/hot/only-dev-server',
  ];

  return ({
    entry: Array.isArray(entry)
      ? [...hmrEntry, ...entry]
      : [...hmrEntry, entry],
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
    ],
  });
};

exports.inlineImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|jpeg|svg)$/,
        include,
        exclude,
        use: {
          loader: 'url-loader',
          options: Object.assign({}, {
            limit: 150000,
          }, options),
        },
      },
    ],
  },
});

exports.lintJavaScript = ({ include, exclude = /node_modules/, options }) => ({
  module: {
    rules: [
      {
        test: /\.jsx$/,
        include,
        exclude,
        enforce: 'pre',
        loader: 'eslint-loader',
        options,
      },
    ],
  },
});

exports.loadHtmlTemplate = ({ filename, template, appId, injectStyle }) => ({
  plugins: [
    new HtmlWebpackPlugin({
      filename,
      template,
      alwaysWriteToDisk: true,
      body: `<div id="${appId}"><%= body %></div>`,
      style: injectStyle ? '<style><%= css %></style>' : '',
      rehydrate: injectStyle ? '<script>window._glam = <%= ids %>;</script>' : '',
    }),
    new HtmlWebpackHarddiskPlugin(),
  ],
});

exports.loadImages = (options = {}, jpgQuality = '75', pngQuality = '75-90') => ({
  module: {
    rules: [{
      test: /\.(png|jpg|gif|jpeg|svg)$/,
      loaders: [
        {
          loader: 'file-loader',
          options,
        },
        {
          loader: 'image-webpack-loader',
          query: {
            mozjpeg: {
              progressive: true,
              quality: jpgQuality,
            },
            gifsicle: {
              interlaced: false,
            },
            pngquant: {
              optimizationLevel: 7,
              quality: pngQuality,
              speed: 4,
            },
          },
        },
      ],
    }],
  },
});

exports.minifyJavascript = () => ({
  plugins: [
    new BabiliPlugin({}, {
      comments: false,
      sourceMap: false,
    }),
  ],
});

exports.setEnvVariables = (vars = {}) => ({
  plugins: [
    new webpack.DefinePlugin({
      'process.env': vars,
    }),
  ],
});

exports.transpileJavaScript = (options = {}) => ({
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: Object.assign({}, {
          cacheDirectory: true,
        }, options),
      },
    }],
  },
});
