import {
  FETCH_COIN_PRICE_ERROR,
  FETCH_COIN_PRICE_PENDING,
  FETCH_COIN_PRICE_SUCCESS,
  SET_ELSE,
  SET_TEST,
} from 'constants/actions';

export const setTest = (value) => ({
  type: SET_TEST,
  payload: value,
});

export const setElse = (value) => ({
  type: SET_ELSE,
  payload: value,
});

export const fetchCoinPrice = () => ({
  types: [
    FETCH_COIN_PRICE_PENDING,
    FETCH_COIN_PRICE_SUCCESS,
    FETCH_COIN_PRICE_ERROR,
  ],
  callAPI: () =>
    fetch('https://api.coinmarketcap.com/v1/ticker/litecoin/').then((res) =>
      res.json(),
    ),
  formatData: (response) => ({ coinPrice: response[0].price_usd }),
});
