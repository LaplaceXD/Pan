import auth from "@utils/auth";

export async function getAllProducts({ signal }) {
  return await auth.get("/products", { signal });
}

export async function getProductById(productId, { signal }) {
  return await auth.get("/products/" + productId, { signal });
}
