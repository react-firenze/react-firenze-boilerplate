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
      /*
        When deploying our app to services like heroku, all of our packages and
        dependencies are installed on the server as well. This means that we
        don't need to add any of that to our final server bundle. The node
        externals plugin allows us to do that preventing any dependency to be
        added to our server file.
      */
      externals: [nodeExternals()],
    },
    /*
      This simply limits the number of chunks to prevent code splitting on the
      server
    */
    parts.limitChunks(1),
    /*
      Although we are pretty familiar by now with this part, it is crucial to
      remember that our server.js file is also accessing some environmental
      variables.

      If we don't set them here properly, our server won't run (or it will run
      with defaults we set but it won't run once deployed). Especially if we
      don't set the PORT.

      To give you an example if you try to deploy to Heroku without reading the
      PORT from process.env, you might end up forcing it to use whichever port
      you set as default and, in that case, it won't be able to use the one
      set automatically.
    */
    parts.setEnvVariables({
      NODE_ENV: JSON.stringify('server'),
      PORT: JSON.stringify(process.env.PORT),
      MY_ENV_VAR: JSON.stringify(process.env.MY_ENV_VAR),
    }),
    /*
      The presets lets you specify an environment and automatically enables
      the necessary plugins. If compiling for Node like we are going to do
      here, Babel will react to the current running version of Node, if we set
      the target to 'current'
    */
    parts.transpileJavaScript({
      presets: [['@babel/env', { targets: { node: 'current' } }]],
    }),
    /*
      It is important to tell the server how to read images, if that's not the
      case then it would error whenever an image is reference in the portion
      of the app that is server side rendered.

      On the other hand we don't want to emit such files because we already
      do that in the production configuration. As you notice we do not specify
      an outputPath.

      Be careful to use the same naming pattern here and in the production
      config. It happened to me that using different patterns (e.g. omitting the
      hash) would break server side rendering.
    */
    parts.loadImages({
      name: '[name].[hash:8].[ext]',
      publicPath: '/images/',
      emitFile: false,
    }),
    /*
      Worth noting that we are not doing any minification nor we are using the
      plugin to clean the server "dist" folder. The reason being that we don't
      need to serve this code to the client and minifcation serves no purpose
      other than slow down compilation time (in this case).
    */
  ]);
