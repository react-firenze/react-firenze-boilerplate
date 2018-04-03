/* eslint no-underscore-dangle: 0 */
import { applyMiddleware, compose, createStore } from 'redux';
import slimAsync from 'redux-slim-async';
import rootReducer from '../reducers';

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__INITIAL_STATE__;
// Allow the passed state to be garbage-collected
delete window.__INITIAL_STATE__;

const store = createStore(
  rootReducer,
  preloadedState,
  compose(
    applyMiddleware(slimAsync),
    typeof window === 'object'
    && typeof window.devToolsExtension !== 'undefined'
      ? window.devToolsExtension()
      : (f) => f,
  ),
);

if (module.hot) {
  module.hot.accept('../reducers', () => {
    // eslint-disable-next-line
    const nextRootReducer = require('../reducers/index.js');
    store.replaceReducer(nextRootReducer);
  });
}

export default store;
