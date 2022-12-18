import actions from "./actions";

function cartReducer(state, action) {
  let index;
  const { payload, type } = action;

  switch (type) {
    case actions.ADD_ITEM:
      index = state.findIndex((item) => item.id === payload.id);
      return index === -1 ? [...state, payload] : state;
    case actions.REMOVE_ITEM:
      index = state.findIndex((item) => item.id === payload.id);
      return index === -1 ? state : state.splice(index, 1);
    case actions.INCREMENT_ITEM:
      return state.map((item) =>
        item.id === payload.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    case actions.DECREMENT_ITEM:
      return state
        .map((item) => (item.id === payload.id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter(({ quantity }) => quantity !== 0);
    case actions.CLEAR_CART:
      return [];
  }

  return state;
}

export default cartReducer;
