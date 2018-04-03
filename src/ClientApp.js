/* eslint no-underscore-dangle: 0 */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import { hydrate, render } from 'react-dom';
import { rehydrate } from 'glamor';
import Loadable from '@react-firenze/react-loadable';
import store from './store/store';
import routes from './routes';

if (process.env.NODE_ENV === 'production') rehydrate(window._glam);

const renderApp = () => {
  if (process.env.NODE_ENV === 'production') {
    Loadable.preloadReady().then(() => {
      hydrate(
        <Provider store={store}>
          <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
        </Provider>,
        document.getElementById('app'),
      );
    });
  } else {
    render(
      <Provider store={store}>
        <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
      </Provider>,
      document.getElementById('app'),
    );
  }
};

renderApp();

if (module.hot) module.hot.accept();
