import { useState } from "react";

import {
  getAccessToken,
  getTokenPayload,
  isExpired,
  removeAccessToken,
  removeRefreshToken,
} from "@utils/token";
import AuthContext from "./AuthContext";

function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const accessToken = getAccessToken();

    if (accessToken) {
      if (!isExpired(accessToken)) {
        return getTokenPayload(accessToken);
      }

      removeAccessToken();
      removeRefreshToken();
    }

    return null;
  });

  return <AuthContext.Provider value={[auth, setAuth]}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
