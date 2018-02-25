import { SET_TEST, SET_ELSE } from 'constants/actions';

export const setTest = value => ({
  type: SET_TEST,
  payload: value,
});

export const setElse = value => ({
  type: SET_ELSE,
  payload: value,
});
