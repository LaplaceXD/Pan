import auth from "@utils/auth";

export async function getAllProducts({ signal }) {
  return await auth.get("/products", { signal });
}
