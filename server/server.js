/* eslint no-console:0 */
import 'isomorphic-fetch';
import envVars from 'dotenv';

import _ from 'lodash';
import compression from 'compression';
import express from 'express';
import fs from 'fs';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import slimAsync from 'redux-slim-async';
import { renderStaticOptimized } from 'glamor/server';
import Loadable from '@react-firenze/react-loadable';
import { getBundles } from '@react-firenze/react-loadable/webpack';
import stats from './react-loadable.json';
import routes from '../src/routes';
import reducers from '../src/reducers/index';

envVars.config();

const port = process.env.PORT || 3000;
const baseTemplate = fs.readFileSync('./public/index.html');
const template = _.template(baseTemplate);
const server = express();
const store = createStore(reducers, applyMiddleware(slimAsync));

server.use(compression());
server.use('/public', express.static('./public'));
server.use('/js', express.static('./public/js'));
server.use('/images', express.static('./public/images'));

server.use((req, res) => {
  const modules = [];
  const context = {};
  const branch = matchRoutes(routes, req.url);
  const promises = branch.map(({ route, match }) => {
    const fetchData = route.fetchData;

    return fetchData instanceof Function
      ? fetchData(store, match)
      : Promise.resolve(null);
  });

  if (context.url) res.redirect(context.url);

  Promise.all(promises).then(() => {
    const { html: body, css, ids } = renderStaticOptimized(() =>
      ReactDOMServer.renderToString(
        <Loadable.Capture report={(moduleName) => modules.push(moduleName)}>
          <Provider store={store}>
            <StaticRouter context={context} location={req.url}>
              {renderRoutes(routes)}
            </StaticRouter>
          </Provider>
        </Loadable.Capture>,
      ),
    );

    const bundles = getBundles(stats, modules);

    res.write(
      template({
        body,
        css,
        ids: JSON.stringify(ids),
        /*
          WARNING: See the following for security issues around embedding JSON
          in HTML:

          http://redux.js.org/recipes/ServerRendering.html#security-considerations
        */
        initialState: JSON.stringify(store.getState()).replace(/</g, '\\u003c'),
        bundles: bundles
          .map((bundle) => `<script src="/js/${bundle.file}"></script>`)
          .join('\n'),
      }),
    );
    res.end();
  });
});

Loadable.preloadAll().then(() => {
  console.log(`listening on ${port}`);
  server.listen(port);
});
