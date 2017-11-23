/* eslint no-console:0 */
require('babel-register');
require('dotenv').config();

const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const ReactRouter = require('react-router-dom');
const _ = require('lodash');
const fs = require('fs');
const compression = require('compression');
const renderStaticOptimized = require('glamor/server').renderStaticOptimized;
const App = require('../src/App').default;

const StaticRouter = ReactRouter.StaticRouter;
const port = process.env.PORT || 8080;
const baseTemplate = fs.readFileSync('./public/index.html');
const template = _.template(baseTemplate);

const server = express();

server.use(compression());
server.use('/public', express.static('./public'));
server.use('/js', express.static('./public/js'));
server.use('/images', express.static('./public/images'));

server.use((req, res) => {
  const context = {};
  const { html: body, css, ids } = renderStaticOptimized(() =>
    ReactDOMServer.renderToString(
      React.createElement(
        StaticRouter,
        { location: req.url, context },
        React.createElement(App),
      ),
    ),
  );

  if (context.url) res.redirect(context.url);

  res.write(template({ body, css, ids: JSON.stringify(ids) }));
  res.end();
});

console.log(`listening on ${port}`);
server.listen(port);
