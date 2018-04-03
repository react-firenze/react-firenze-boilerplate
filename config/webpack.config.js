const path = require('path');
/*
  A webpack utils that allows to concatenate arrays and merge objects creating
  a new object. This is the key component that will allow us to build a
  composable configuration for webpack made from multiple parts.
*/
const merge = require('webpack-merge');
/*
  We create three different configurations based on the environment, one for dev
  and one that handles production ready code and server side rendering.
*/
const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');
const serverConfig = require('./webpack.server');

/*
  A simple util to allow loading env variables from a simple .env file.
*/
require('dotenv').config();

/*
  Here we specify all of the paths that we are going to use to reference source
  files, and to determine the destination folders. Having them in one place
  helps playing with them without having to worry about keeping paths in sync
  across multiple configuration files.
*/
const PATHS = {
  app: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  client: path.join(__dirname, '../src'),
  public: path.join(__dirname, '../public'),
  server: path.join(__dirname, '../server'),
};

/*
  Here we can simply specify the title of our app which will then be used
  across our config files to be injected in the HTML template.
*/
const TITLE = 'React Firenze Boilerplate';

/*
  As the name suggests, here we collect all the config options that are common
  to every environment.
*/
const commonConfig = {
  /*
    With context we specify an absolute path used to resolve entry points and
    loader coming from the config.
  */
  context: __dirname,
  /*
    "Resolve extensions" tells webpack to automatically look for files ending
    with .js, .jsx or .json if no extension is specified. We will be able to
    reference imported files like:

      import myComponent from '../path-to-component/myComponent';

    instead of:

      import myComponent from '../path-to-component/myComponent.js';
  */
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    /*
      Aliases are a very handy way to specify shorthand versions of commonly
      used paths, so we can do things like:

        import myComponent from 'components/myComponent';

      This is helpful because no matter how deep or high up in the folder
      structure we are, we can simply use the alias and webpack will resolve
      that path for us.

      If you are using eslint (like we do in this boilerplate), you need to
      specify in your eslint configuration that webpack is used to resolve
      certain paths, otherwise the linter will throw errors.
    */
    alias: {
      actions: path.resolve(__dirname, '../src/actions'),
      constants: path.resolve(__dirname, '../src/constants'),
      components: path.resolve(__dirname, '../src/components'),
      containers: path.resolve(__dirname, '../src/containers'),
      images: path.resolve(__dirname, '../assets/images'),
      utils: path.resolve(__dirname, '../src/utils'),
    },
  },
  /*
    With stats we can decide with great granularity what should be showed in the
    webpack output to console. In this case we are allowing colors, which helps
    for immediate feedback and at times readability in general.

    Reasons adds information about why modules are included and chunks will
    provide for additional information about the chunks that have been
    generated. I like to keep such logs disabled until I need more info about
    generated chunks.

    This setup is very minimal but works good for me as I can come here and
    enable anything I need when necessary.
  */
  stats: {
    colors: true,
    reasons: false,
    chunks: false,
    hash: false,
    modules: false,
  },
  /*
    Very simple boolean configuration that will force webpack to stop the
    bundling process in case an error is thrown. This is valuable especially
    in CI environments.
  */
  bail: true,
};

/*
  Here we decide which configuration to use based on the environment. As you
  might notice this is already a perfect use case for 'merge'. It will allow us
  to merge the common configuration we just set up, with one that is picked base
  on NODE_ENV.

  It is common practice that the default configuration is Dev, while the other
  ones are invoked based on NODE_ENV values. Also notice how we are passing down
  the PATHS and TITLE so that they can be easily used inside each config.
*/
module.exports = () => {
  if (process.env.NODE_ENV === 'production') {
    return merge(commonConfig, prodConfig(PATHS, TITLE));
  } else if (process.env.NODE_ENV === 'server') {
    return merge(commonConfig, serverConfig(PATHS));
  }

  return merge(commonConfig, devConfig(PATHS, TITLE));
};
