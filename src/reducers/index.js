import { createReducer, updateObject } from '../utils/reduxUtils';
import { SET_TEST, SET_ELSE } from '../actions';

const INITIAL_STATE = {
  test: 'If you click the button this text will update through Redux!',
  else: 'Just another field!'
};

function setTest(state, action) {
  return updateObject(state, { test: action.payload });
}

const rootReducer = createReducer(INITIAL_STATE, {
  [SET_TEST]: setTest,
  [SET_ELSE]: (rootState, action) => updateObject(rootState, { else: action.payload }),
})

export default rootReducer;
