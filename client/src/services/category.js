import auth from "@utils/auth";

export async function getAllCategories({ signal }) {
  return await auth.get("/categories", { signal });
}

export async function createCategory(body) {
  return await auth.post("/categories", body);
}

export async function editCategoryById(categoryId, body) {
  return await auth.put("/categories/" + categoryId, body);
}

export async function deleteCategoryById(categoryId) {
  return await auth.delete("/categories/" + categoryId);
}
