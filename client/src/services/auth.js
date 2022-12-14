import api from "@utils/api";

export async function loginEmployee({ email, password }) {
  return await api.post("/auth/login", { email, password });
}
