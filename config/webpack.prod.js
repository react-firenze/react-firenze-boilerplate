const path = require('path');
const merge = require('webpack-merge');
/*
  Since we are interested in code splitting and server side rendering, we need
  a way to tell the server how every module maps to a chunk. This plugin will
  generate a file with all the necessary mappings.
*/
const {
  ReactLoadablePlugin,
} = require('@react-firenze/react-loadable/webpack');
const parts = require('./webpack.parts');
const webpack = require('webpack');

/*
  As seen across other configurations, we group here variables that are used
  multiple times across the file. This helps keeping in one place the name of
  three fundamental chunks that will build our app.
*/
const VENDORS_CHUNK = 'commons';
const MANIFEST_CHUNK = 'manifest';
const MAIN_CHUNK = 'main';

module.exports = (PATHS, TITLE) =>
  merge([
    /*
      We should now be fairly familiar with this part of the config. For
      production the devtool option is set to false, this means that our code
      will be build fast, unfortunately debugging production code will be tricky
      as we will only have access to the final bundled, transpile and minified
      version of the source. There are alternatives that will help with this but
      slowing down significantly the building time.

      Here the output has a reference to the public path, with the addition
      of the '/js/' folder, this means that the result of webpack
      compilation will be emitted to '/public/js'.

      The 'publicPath' on the other hand, indicates the path that is going
      to be used in the browser. I like to keep consistency between
      folder structure and browser paths to avoid confusion.
    */
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
        /*
          This plugin allows what's called "scope hoisting". Instead of wrapping
          each module in individual function closures, this plugin concatenates
          the scope of all the modules into one closure allowing for faster
          execution time in the browser!
        */
        new webpack.optimize.ModuleConcatenationPlugin(),
        /*
          We explained the reason behind this plugin earlier, here we just
          need to provide a path where we want to save our module mappings.
        */
        new ReactLoadablePlugin({
          filename: path.join(PATHS.server, '/react-loadable.json'),
        }),
      ],
    },
    /*
      Differently from the dev configuration, here we want to inject the style
      to allow for server side rendering. We also inject the state which is
      initialized on the server and we make it available for our app to grab.

      Inside the webpack.parts.js file you will notice how such state is made
      available through the global variable window.__INITIAL_STATE__. Such
      variable is then leveraged by the store to initialize the state.

      As mentioned in the webpack.parts.js file we need to specify every chunk
      so that we can determine in which order they are added to the index HTML
      file. This is important to avoid page flashing due to unnecessary
      re-rendering on the client.
    */
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
    /*
      It is important to make the NODE_ENV variable accessible, especially
      if it is used as a flag to enable/disable features.
    */
    parts.setEnvVariables({
      NODE_ENV: JSON.stringify('production'),
      MY_ENV_VAR: JSON.stringify(process.env.MY_ENV_VAR),
    }),
    parts.clean(PATHS.public),
    /*
      If you were to create a unique bundle with all of the js used by your app
      (including dependencies), every time you make a change and deploy, the
      whole bundle would be regenerated and the user would have to download the
      whole app again.

      What if we could have him/her download only the app code that is more
      likely to go through changes ? With this configuration we can extract node
      modules (which are less likely to change), in a separate file. This means
      that our user will only have to download this the first time and have it
      cached for every other request.

      The last part is the 'manifest' such file describes what files webpack
      should load. It's possible to extract it and start loading files of the
      project faster, instead of having to wait for the commons bundle to be
      loaded.
    */
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
    /*
      At this point we should already be familiar with the transpilation process
    */
    parts.transpileJavaScript(),
    /*
      Here we tell webpack how to load images, how to name them and where to
      store them. The small detail is that the outputPath is relative to the
      output.path option we specified previously.

      Specifically our output.path is now '/public/js/' so in order to attain
      '/public/images/' we need to navigate one level up in the folder
      structure.
    */
    parts.loadImages({
      name: '[name].[hash:8].[ext]',
      outputPath: '../images/',
      publicPath: '/images/',
    }),
    /*
      We didn't have this in development but it's crucial in production to
      reduce the size of the bundle.
    */
    parts.minifyJavascript(),
  ]);
