import { applyMiddleware, createStore, compose } from 'redux';
import { callAPIMiddleware } from 'utils/reduxUtils';
import reducer from '../reducers';

const store = createStore(
  reducer,
  compose(
    applyMiddleware(callAPIMiddleware),
    typeof window === 'object'
    && typeof window.devToolsExtension !== 'undefined'
      ? window.devToolsExtension()
      : f => f,
  ),
);

if (module.hot) {
  module.hot.accept('../reducers', () => {
    // eslint-disable-next-line
    const nextRootReducer = require('../reducers/index');
    store.replaceReducer(nextRootReducer);
  });
}

export default store;
