import auth from "@utils/auth";

export async function getAllCategories({ signal }) {
  return await auth.get("/categories", { signal });
}

export async function createCategory(body) {
  return await auth.post("/categories", body);
}
