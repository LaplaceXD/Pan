import auth from "@utils/auth";

export async function getAllStocksByProductId(productId, { signal }) {
  return await auth.get("/stocks?for=product&id=" + productId, { signal });
}

export async function getAllStocksBySupplierId(supplierId, { signal }) {
  return await auth.get("/stocks?for=supplier&id=" + supplierId, { signal });
}

export async function getStockById(stockId, { signal }) {
  return await auth.get("/stocks/" + stockId, { signal });
}

export async function createStock(body) {
  return await auth.post("/stocks", body);
}

export async function editStockById(stockId, body) {
  return await auth.put("/stocks/" + stockId, body);
}

export async function deleteStockById(stockId) {
  return await auth.delete("/stocks/" + stockId);
}
