import auth from "@utils/auth";

export async function getAllEmployees({ signal }) {
  return await auth.get("/employees", { signal });
}
export async function getEmployeeById(userId, { signal }) {
  return await auth.get("/employees/" + userId, { signal });
}

export async function createEmployee(body) {
  return await auth.post("/employees", body);
}

export async function editEmployeeById(userId, body) {
  return await auth.put("/employees/" + userId, body);
}

export async function changeEmployeePasswordById(userId, body) {
  return await auth.put("/employees/" + userId + "/password", body);
}

export async function resetEmployeePasswordById(userId) {
  return await auth.post("/employees/" + userId + "/password", {});
}

export async function toggleEmployeeStatusById(userId) {
  return await auth.put("/employees/" + userId + "/status", {});
}
