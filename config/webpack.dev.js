/* eslint import/no-extraneous-dependencies: 0 */
const path = require('path');
const webpack = require('webpack');
/*
  This plugin does not provide any optimization benefit, its only purpose is to
  recognize certain classes of webpack errors and organize them to provide a
  better developer experience.
*/
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
/*
  This is purely for fun! You can even add custom messages so the nyan cat says
  whatever you want it to say!
*/
const NyanProgressPlugin = require('nyan-progress-webpack-plugin');
/*
  Simple plugin to automatically open the browser at the given address where
  your app is running. This will allow you to simply run (e.g.) 'npm run dev'
  and after compilation, the app will automatically open in the browser.
*/
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');

/*
  Better define the PORT here since it's used in multiple entries of our config,
  I prefer to specify a port separately for each config.
*/
const PORT = 8080;
const HOST = 'localhost';

module.exports = (PATHS, TITLE) =>
  merge([
    {
      /*
        This entry affects build and rebuild speed significantly. There are
        several options that are worth exploring and you can find a detail list
        here: https://webpack.js.org/configuration/devtool/#devtool

        In this case what matters to me is to keep the original code and not the
        transformed one. This helps debugging but comes with medium speed
        builds. For development you should not care about the bundle size but
        speed could become an issue as the app grows, pick carefully but don't
        worry too much. If your builds are too slow you can always come here and
        change it!

        Remember that usually keeping the source code is more expensive than
        presenting the transformed one, this means that it is a slower build and
        rebuild process.

        If you have the chance, I would suggest playing with it and find out
        what you're more comfortable with.
      */
      devtool: 'cheap-module-source-map',
      /*
        The output will only be consisting of one configuration, contrary to the
        entry which can have multiple points.

        The decision made here was to place javaScript assets in a js folder.
        With 'path' we specify a preferred output directory for this asset,
        if you notice I made sure it matches the publicPath so there's less
        confusion.

        If you open your 'Source' panel in the chrome dev tools (or any other
        browser), you will notice that the folder structure reflects what
        specified here. This works well because our index file references
        exactly this path.

        You can play with the folder structure of your output, be careful though
        to reference the right folders within your configuration and in your
        index html file.
      */
      output: {
        path: path.join(__dirname, 'js'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/js/',
      },
      /*
        Here we define the plugins we want webpack to use, we can pass options
        if the plugin allows for it and customize their behavior where possible.

        If you look at the open browser plugin we need to pass a url which will
        be the one opened once compilation is complete.
      */
      plugins: [
        new FriendlyErrorsWebpackPlugin(),
        new NyanProgressPlugin(),
        new webpack.NamedModulesPlugin(),
        new OpenBrowserPlugin({ url: `http://${HOST}:${PORT}` }),
      ],
    },
    /*
      From here on you will see an extensive use of 'parts'. These are used
      to create a composable configuration that can be reused across
      different environments easily. The naming should also help clarifying
      what the snippet of configuration purpose is.

      We start with a simple .clean, as you can imagine this will simply clean
      up the /public folder to make sure we remove unused files and avoid piling
      up files with different hashes (if that is the case).
    */
    parts.clean(PATHS.public),
    /*
      This allows to use a template to generate the final index.html. Script
      tags are injected dynamically, the appId is used to determine which id
      is used to reference the div where our app should be loaded.

      We also define a path to the template and a path to the output index.
      As you notice we were able to leverage the paths shared across
      configurations. If for some reason we decide to change such paths,
      we can do so without the need to come back here and update.

      The last flag simply provides the title that will be added into the html
      index file.
    */
    parts.loadHtmlTemplate({
      filename: path.join(PATHS.public, '/index.html'),
      template: path.join(PATHS.app, '/index.html'),
      appId: 'app',
      title: TITLE,
    }),
    /*
      Here you can determine which environmental variables can be referenced
      from within the app in development. Remember to stringify in order to
      allow the conversion of a JSON value to a js string.

      Using the 'setEnvVariables' I am able to hide some configuration, allowing
      to intuitively add or remove entries. It's just a simple abstraction on
      top of what webpack (with the use of plugins) can offer.
    */
    parts.setEnvVariables({
      MY_ENV_VAR: JSON.stringify(process.env.MY_ENV_VAR),
    }),
    /*
      This allows us to only pass in the minimum amount of options to make
      HMR work, we need to know the host, the port and the entry point for
      our app. Everything else is handled within the 'parts' file.
    */
    parts.hotModuleRelaod({
      host: HOST,
      port: PORT,
      entry: path.join(PATHS.client, '/ClientApp.js'),
    }),
    /*
      Here we can specify a few options for our dev server, the 'contentBase'
      will tell the server where to serve the content from. This is necessary
      if you want to serve static files.

      The 'publichPath' will determine the path where the bundled files will be
      available. If you notice this path matches the publicPath specified in
      the output.

      Host and port will be simply indicating the address we are going to use
      for our dev server, pay attention that this needs to be related to the
      hot module reload and the open browser plugin.
    */
    parts.devServer({
      contentBase: PATHS.public,
      publicPath: '/js/',
      host: HOST,
      port: PORT,
    }),
    /*
      No options required in this case, it's clear what we are trying to achieve
      here. We want all the latest javascript features! In order to do so your
      code needs to go through a transpiler, there are plenty resources out
      there that go into details about this process.
    */
    parts.transpileJavaScript(),
    /*
      As the name suggests, we inline images which is more than fine in
      development. You will see how this setup for images changes completely in
      production.
    */
    parts.inlineImages(),
  ]);
