import auth from "@utils/auth";

export async function getEmployeeById(userId, { signal }) {
  return await auth.get("/employees/" + userId, { signal });
}

export async function editEmployeeById(userId, body) {
  return await auth.put("/employees/" + userId, body);
}

export async function changeEmployeePasswordById(userId, body) {
  return await auth.put("/employees/" + userId + "/password", body);
}
