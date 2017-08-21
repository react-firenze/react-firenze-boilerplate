import { SET_TEST, SET_ELSE } from '../actions';

export function setTest(value) {
  return { type: SET_TEST, payload: value };
}

export function setElse(value) {
  return { type: SET_ELSE, payload: value };
}
