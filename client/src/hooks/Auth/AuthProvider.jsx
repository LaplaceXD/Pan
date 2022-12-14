import { useState } from "react";

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

  return <AuthContext.Provider value={[auth, setAuth]}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
