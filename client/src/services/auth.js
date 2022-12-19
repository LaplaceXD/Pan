import api from "@utils/api";
import auth from "@utils/auth";

export async function loginEmployee({ email, password }) {
  return await api.post("/auth/login", { email, password });
}

export async function logoutEmployee(tokens) {
  return await auth.post("/auth/logout", tokens);
}
