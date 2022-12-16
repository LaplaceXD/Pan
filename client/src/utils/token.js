import jwtDecode from "jwt-decode";

const tokenType = Object.freeze({
  ACCESS: "access",
  REFRESH: "refresh",
});

class Token {
  constructor(type) {
    this.type = type;
  }

  get() {
    return localStorage.getItem(this.type);
  }

  set(token) {
    localStorage.setItem(this.type, token);
  }

  remove() {
    localStorage.removeItem(this.type);
  }

  payload(options) {
    const { iss, aud, iat, jti, exp, ...data } = jwtDecode(this.get(), options);
    return data;
  }

  get isExpired() {
    const { exp } = jwtDecode(this.get());
    return exp * 1000 < Date.now();
  }
}

const access = new Token(tokenType.ACCESS);
const refresh = new Token(tokenType.REFRESH);

export default {
  refresh,
  access,
  pair: {
    get: () => ({ access: access.get(), refresh: refresh.get() }),
    set: ({ access: accessToken, refresh: refreshToken }) => {
      access.set(accessToken);
      refresh.set(refreshToken);
    },
    remove: () => {
      access.remove();
      refresh.remove();
    },
  },
};
