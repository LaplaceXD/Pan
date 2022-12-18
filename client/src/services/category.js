import auth from "@utils/auth";

export async function getAllCategories({ signal }) {
  return await auth.get("/categories", { signal });
}
