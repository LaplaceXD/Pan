import auth from "@utils/auth";

export async function getAllProducts(signal) {
  return auth.get("/products", { signal });
}
