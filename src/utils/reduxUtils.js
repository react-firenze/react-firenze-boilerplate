export function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    }

    return state;
  }
};

export function updateObject(oldObject, newValues) {
  return Object.assign({}, oldObject, newValues);
}
