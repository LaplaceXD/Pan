import { useState } from "react";

import { loginEmployee, logoutEmployee } from "@services/auth";
import token from "@utils/token";
import AuthContext from "./AuthContext";

function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const accessToken = token.access.get();

    if (accessToken) {
      if (!token.refresh.isExpired) {
        return token.access.payload();
      }

      token.pair.remove();
    }

    return null;
  });

  async function logout() {
    await logoutEmployee();

    token.pair.remove();
    setAuth(null);
  }

  async function login({ email, password }) {
    const { error, message, data: tokens } = await loginEmployee({ email, password });
    if (error) return message;

    token.pair.set({ access: tokens.access, refresh: tokens.refresh });
    setAuth(token.access.payload());
    return null;
  }

  return <AuthContext.Provider value={{ user: auth, login, logout }}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
