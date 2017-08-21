import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from 'react-dom';
import Perf from 'react-addons-perf';
import App from '../App';

if (process.env.NODE_ENV !== 'production') {
  window.Perf = Perf;
  Perf.start();
}

const renderApp = () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('app')
  );
};

renderApp();

if (module.hot) {
  module.hot.accept('../App', () => {
    renderApp();
  });
}
