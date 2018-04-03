import {
  FETCH_COIN_PRICE_ERROR,
  FETCH_COIN_PRICE_PENDING,
  FETCH_COIN_PRICE_SUCCESS,
  SET_ELSE,
  SET_TEST,
} from 'constants/actions';
import { createReducer } from 'utils/reduxUtils';

const INITIAL_STATE = {
  coinPrice: null,
  fetchCoinPriceError: null,
  test: 'If you click the button this text will update through Redux!',
  else: 'Just another field!',
};

const rootReducer = createReducer(INITIAL_STATE, {
  [FETCH_COIN_PRICE_ERROR]: (rootState, action) => ({
    ...rootState,
    fetchCoinPriceError: action.error.message,
    isFetchingCoinPrice: false,
  }),
  [FETCH_COIN_PRICE_PENDING]: (rootState) => ({
    ...rootState,
    fetchCoinPriceError: null,
    isFetchingCoinPrice: true,
  }),
  [FETCH_COIN_PRICE_SUCCESS]: (rootState, action) => ({
    ...rootState,
    fetchCoinPriceError: null,
    isFetchingCoinPrice: false,
    coinPrice: action.payload.coinPrice,
  }),
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
