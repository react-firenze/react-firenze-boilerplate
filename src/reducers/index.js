import { SET_TEST, SET_ELSE } from 'constants/actions';
import { createReducer } from 'utils/reduxUtils';

const INITIAL_STATE = {
  test: 'If you click the button this text will update through Redux!',
  else: 'Just another field!',
};

const rootReducer = createReducer(INITIAL_STATE, {
  [SET_TEST]: (rootState, action) => ({
    ...rootState,
    test: action.payload,
  }),
  [SET_ELSE]: (rootState, action) => ({
    ...rootState,
    else: action.payload,
  }),
});

export default rootReducer;
