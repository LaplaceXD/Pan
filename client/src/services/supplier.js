import auth from "@utils/auth";

export async function getAllSuppliers({ signal }) {
  return await auth.get("/suppliers", { signal });
}

export async function getSupplierById(supplierId, { signal }) {
  return await auth.get("/suppliers/" + supplierId, { signal });
}

export async function createSupplier(body) {
  return await auth.post("/suppliers", body);
}

export async function editSupplierById(supplierId, body) {
  return await auth.put("/suppliers/" + supplierId, body);
}

export async function toggleSupplierStatusById(supplierId) {
  return await auth.put("/suppliers/" + supplierId + "/status", {});
}
