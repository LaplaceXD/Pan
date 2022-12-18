import auth from "@utils/auth";

export async function getAllOrders({ signal }) {
  return await auth.get("/orders", { signal });
}

export async function getOrderById(orderId, { signal }) {
  return await auth.get("/orders/" + orderId, { signal });
}

export async function createOrder(order) {
  return await auth.post("/orders", order);
}
