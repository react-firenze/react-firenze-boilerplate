const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const PORT = 8080;

/*
  This is used to avoid polluting the production folder, the root path
  is relative to where the webpack config is saved. We keep it verbose
  so that we can see in the logs that the cleaning step is taking place.
*/
exports.clean = (dest) => ({
  plugins: [
    new CleanWebpackPlugin([dest], {
      root: path.join(__dirname, '..'),
      verbose: true,
    }),
  ],
});

/*
  This configuration allows us to run a development server, it comes with
  plenty of customizable options. Here we try to set only the minimum amount
  required for a good developer experience.

  - 'contentBase': this will tell our server where to get our files from
  - 'historyApiFallback': this allows to use the index.html file to be served
    in place of any 404 response
  - 'host' and 'port': are used to determine the address where our app should be
    served
  - 'overlay': when your compilation has errors or warnings they will also
    show on an overlay in your browser
  - 'publicPath': indicates where the bundled files will be available in the
    browser. Make sure to use a full URL for Hot Module Replacement to work
    properly.
  - 'stats': with this option you can control what bundle information gets
    displayed. In this case we decided to keep it minimal with errors and
    warnings only.
*/
exports.devServer = ({
  host = 'localhost',
  port = PORT,
  publicPath,
  contentBase,
} = {}) => ({
  devServer: {
    contentBase,
    historyApiFallback: true,
    host,
    overlay: {
      errors: true,
      warnings: true,
    },
    port,
    publicPath,
    stats: 'errors-only',
  },
});

/*
  The use of this plugin is better described in the production configuration.
  It is an optimization step that allows to separate chunks of code that are
  rarely changed from the ones that are prone to frequent updates. This will
  allow the end user to only re-download the updated chunks.
*/
exports.extractBundles = (bundles) => ({
  plugins: bundles.map(
    (bundle) => new webpack.optimize.CommonsChunkPlugin(bundle),
  ),
});

/*
  Setting up hot module reloading does not happen only through this
  configuration. It involves a snippet in our client app and another snippet in
  our redux store.

  To put it simply, the hmrEntry is always the same while the actual entry point
  of your app might change. Since the entry could be either an array or a single
  string value we need to make a simple check in order to extend the hmrEntry.

  The first plugin is required to enabled hmr globally while the second one is
  a simple help to allow more readable module names in the browser console on
  HMR updates.
*/
exports.hotModuleRelaod = ({ host, port, entry }) => {
  const hmrEntry = [
    `webpack-dev-server/client?http://${host}:${port}`,
    'webpack/hot/only-dev-server',
  ];

  return {
    entry: Array.isArray(entry)
      ? [...hmrEntry, ...entry]
      : [...hmrEntry, entry],
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
    ],
    devServer: {
      hot: true,
    },
  };
};

/*
  This config allows to include images in our app. Other than specifying which
  extensions we are supporting,  we can point specifically to paths that need
  to be included or excluded when using the url-loader.

  The options specify the byte limit to inline files as Data URL, for anything
  bigger the file-loader is used as a fallback by default.

  Keep in mind that without a proper loader, webpack would not know how to
  interpret such files.
*/
exports.inlineImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|jpeg|svg)$/,
        include,
        exclude,
        use: {
          loader: 'url-loader',
          options: Object.assign(
            {},
            {
              limit: 150000,
            },
            options,
          ),
        },
      },
    ],
  },
});

/*
  This very simple plugin allows us to set a max number of chunks. This comes
  in handy for server side rendering as we want to avoid code splitting on the
  server.
*/
exports.limitChunks = (maxChunks) => ({
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks,
    }),
  ],
});

/*
  This adds an additional rule to enforce your js to be linter errors free. If
  any of your file has linting errors, the compilation will be blocked until
  you make the fixes.

  This could be good for beginners but can turn out a bit annoying for more
  experienced developers.
*/
exports.lintJavaScript = ({ include, exclude = /node_modules/, options }) => ({
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include,
        exclude,
        enforce: 'pre',
        loader: 'eslint-loader',
        options,
      },
    ],
  },
});

/*
  This plugin helps creating the index HTML file of our app that serves our
  bundle and chunks. We need to oay attention to some specific details that will
  facilitate Server Side Rendering.
  The 'filename' field will specify where to write the HTML file to, we can use
  one of the common paths across configurations to point to the right folder.

  This plugin provides a default html index but if we need something different
  and custom we can pass in the path to our template. If we do so we can add as
  many fields as we want of data to inject in our template. This will come in
  handy for server side rendering with chunks.

  In our case, here are all the fields employed:
    - body: this will add a dynamic appId that we can specify at configuration
      time other than an anchor for our SSR. The <%= body %> part can be
      interpreted by our server and referenced as 'body' so that it knows where
      the rendered html needs to be placed
    - style: with SSR we can extract also the css necessary to serve the first
      page, similarly to what explained before, we need a hook for the server to
      know where this css needs to be injected. Since we don't care about SSR
      when developing we added a flag to have control over that.
    - rehydrateCss: serves a similar purpose, in this case we are setting a
      global variable named _glam which allows us to simply rehydrate the css
      without creating duplicates. If you take a loo at ClientApp.js we run the
      rehydration before doing anything else (this is crucial), but in order to
      do so it needs to know the ids. With SSR we can determine such ids and
      then simply inject them into our template, this will set up our global
      _glam variables to whatever is passed in. This way when we call rehydrate
      in our code, the ids will be already set up.
    - initialState: sometimes when doing ssr you want to populate your state
      before it's sent down to the client. You can fetch such data through the
      server and then add it to a global variable. Our client App will handle
      rehydration to be in sync with the initial state computed by the server.
      This way tha transition from server side rendered components to client
      rendered components will be unnoticeable.
    - bundles: this is used to inject script tags related to the chunks
      generated from code splitting. This is very useful when doing server side
      rendering as it ensures that all necessary chunks used to render the
      requested page from the server are made available to the client.
    - We also have a reference to the three chunks that will certainly needed in
      our app: main bundle, manifest and vendors. This is normally setup by
      default but since we need a specific ordering we need to inject it
      ourselves. The reason being that the bundles need to appear BEFORE the
      main chunk or it will trigger a refresh even if the app was already
      rendered on the server. If you take a look at the react-loadable docs
      about server side rendering there is a thorough explanation.

    The second plugin is necessary when doing HMR, it is simply an enhancer for
    the html-webpack-plugin that allows to specify an additional option
    (alwaysWriteToDisk). This needs to be set to true or our HMR will fail.
*/
function injectScriptTag(filename) {
  return filename
    ? `<script type="text/javascript" src="/js/${filename}.js"></script>`
    : '';
}

exports.loadHtmlTemplate = ({
  filename,
  template,
  appId,
  title,
  vendorsChunkFilename = null,
  manifestChunkFilename = null,
  mainChunkFilename = 'main',
  injectState = false,
  injectStyle = false,
  injectChunkBundles = false,
}) => ({
  plugins: [
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      filename,
      template,
      inject: false,
      body: `<div id="${appId}"><%= body %></div>`,
      bundles: injectChunkBundles ? '<%= bundles %>' : '',
      manifestChunk: injectScriptTag(manifestChunkFilename),
      mainChunk: injectScriptTag(mainChunkFilename),
      vendorsChunk: injectScriptTag(vendorsChunkFilename),
      rehydrateCss: injectStyle
        ? '<script>window._glam = <%= ids %>;</script>'
        : '',
      style: injectStyle ? '<style><%= css %></style>' : '',
      title,
      initialState: injectState
        ? '<script>window.__INITIAL_STATE__ = <%= initialState %>;</script>'
        : '',
    }),
    new HtmlWebpackHarddiskPlugin(),
  ],
});

/*
  Similarly to the inline image config, we are using the file-loader to handle
  images, on top of that we leverage the image-webpack-loader to setup basic
  optimization on our images. The query params represent the algorithms used
  for compression.
*/
exports.loadImages = (
  options = {},
  jpgQuality = '75',
  pngQuality = '75-90',
) => ({
  module: {
    rules: [
      {
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
      },
    ],
  },
});

/*
  Minifying your js is an important step, there are several plugins for it and
  Uglify seems to provide some very valuable options out of the box that can
  really affect bundling and compiling times. With these options we are removing
  comments from our production bundle, same with sourceMaps.

  On top of that we enable file caching, this will speed up the compilation
  leveraging the cache where possible. Parallel allows the use of parallel
  multi-process to improve build speed.

  With uglifyOptions you have more granular power on what should be compressed
  and what not. Playing with this can improve compile time but might add bytes
  to your bundle. It really depends on what your main goal is, playing with such
  options one can achieve very good results (see official documentation for more
  details).

  I was able to play with all of these option and reduce compilation time up to
  75% without affecting bundle size.
*/
exports.minifyJavascript = () => ({
  plugins: [
    new UglifyJsPlugin(
      {},
      {
        cache: true,
        parallel: true,
        extraComments: false,
        sourceMap: false,
        uglifyOptions: {
          ie8: false,
          compress: {
            conditionals: true,
            dead_code: true,
            evaluate: true,
          },
        },
      },
    ),
  ],
});

/*
  This plugin allows to create global constants which can be configured at
  compile time. It is normally used to allow different behaviors based on the
  target (dev, server or production).
*/
exports.setEnvVariables = (vars = {}) => ({
  plugins: [
    new webpack.DefinePlugin({
      'process.env': vars,
    }),
  ],
});

/*
  To allow us the use of all the latest js features we need to transpile our
  code. Babel will take care of it and we will need a .babelrc file to go along
  with this where we setup our transpiler configuration.
*/
exports.transpileJavaScript = (options = {}) => ({
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: Object.assign(
            {},
            {
              cacheDirectory: true,
            },
            options,
          ),
        },
      },
    ],
  },
});
