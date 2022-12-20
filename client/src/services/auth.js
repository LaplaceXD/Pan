import api from "@utils/api";
import auth from "@utils/auth";
import token from "@utils/token";

export async function loginEmployee({ email, password }) {
  return await api.post("/auth/login", { email, password });
}

export async function logoutEmployee() {
  // The function token.pair.get is passed here to ensure that
  // if the user needs its session revalidated when logging out
  // logout would be able to receive the latest tokens on revalidate
  return await auth.post("/auth/logout", token.pair.get);
}
