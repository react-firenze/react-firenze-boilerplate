/* eslint no-underscore-dangle: 0 */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from 'react-dom';
import { rehydrate } from 'glamor';
import App from './App';

if (process.env.NODE_ENV === 'production') rehydrate(window._glam);

const renderApp = () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('app'),
  );
};

renderApp();

if (module.hot) {
  module.hot.accept('./App', () => {
    renderApp();
  });
}
