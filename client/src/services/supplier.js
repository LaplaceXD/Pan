import auth from "@utils/auth";

export async function getAllSuppliers({ signal }) {
  return await auth.get("/suppliers", { signal });
}
