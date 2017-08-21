const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

exports.devServer = ({ host, port, publicPath, contentBase } = {}) => ({
  devServer: {
    hot: true,
    publicPath,
    historyApiFallback: true,
    contentBase,
    stats: 'errors-only',
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    overlay: {
      errors: true,
      warnings: true,
    },
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
      }
    }],
  },
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
              speed: 4
            }
          }
        }
      ]
    }],
  },
});

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
        }
      },
    ],
  },
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
      new webpack.NamedModulesPlugin()
    ]
  });
}

exports.extractBundles = (bundles) => ({
  plugins: bundles.map(bundle => (
    new webpack.optimize.CommonsChunkPlugin(bundle)
  )),
});

exports.clean = (dest) => ({
  plugins: [
    new CleanWebpackPlugin([dest], {
      root: path.join(__dirname , '..'),
      verbose: true,
      dry: false
    })
  ]
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

exports.loadHtmlTemplate = ({ filename, template, appId }) =>  ({
  plugins: [
    new HtmlWebpackPlugin({
      filename,
      template,
      alwaysWriteToDisk: true,
      body: `<div id="${appId}"><%= body %></div>`,
      style: '<style><%= css %></style>'
    }),
    new HtmlWebpackHarddiskPlugin()
  ]
})
