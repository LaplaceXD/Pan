import auth from "@utils/auth";

export async function getAllProducts({ signal }) {
  return await auth.get("/products", { signal });
}

export async function getProductById(productId, { signal }) {
  return await auth.get("/products/" + productId, { signal });
}

export async function createProduct(body) {
  return await auth.post("/products", body);
}

export async function editProductById(productId, body) {
  return await auth.put("/products/" + productId, body);
}

export async function toggleProductStatusById(productId) {
  return await auth.put("/products/" + productId + "/status", {});
}
