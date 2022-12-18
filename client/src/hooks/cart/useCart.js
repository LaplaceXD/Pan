import { useReducer } from "react";
import actions from "./actions";
import cartReducer from "./cartReducer";

function useCart(products) {
  /**
   * Cart contains an array of objects in the form of
   * {
   *   id: number,
   *   quantity: number
   * }
   */
  const [cart, dispatch] = useReducer(cartReducer, []);
  const cartWithProducts = cart.map(({ quantity, id }) => ({
    quantity,
    ...products.find(({ product_id }) => id === product_id),
  }));
  const cartTotal = cartWithProducts.reduce(
    (total, { unit_price, quantity }) => total + unit_price * quantity,
    0
  );

  return {
    items: cartWithProducts,
    total: cartTotal,
    isEmpty: cart.length === 0,
    get: (id) => cart.find((item) => item.id === id),
    add: (payload) => dispatch({ type: actions.ADD_ITEM, payload }),
    remove: (id) => dispatch({ type: actions.REMOVE_ITEM, payload: { id } }),
    clear: () => dispatch({ type: actions.CLEAR_CART }),
    increment: (id) => dispatch({ type: actions.INCREMENT_ITEM, payload: { id } }),
    decrement: (id) => dispatch({ type: actions.DECREMENT_ITEM, payload: { id } }),
  };
}

export default useCart;
