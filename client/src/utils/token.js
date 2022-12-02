import jwtDecode from "jwt-decode";

const tokenType = Object.freeze({
  ACCESS: "access",
  REFRESH: "refresh",
});

export function getAccessToken() {
  return localStorage.getItem(tokenType.ACCESS);
}

export function getRefreshToken() {
  return localStorage.getItem(tokenType.REFRESH);
}

export function setAccessToken(token) {
  localStorage.setItem(tokenType.ACCESS, token);
}

export function setRefreshToken(token) {
  localStorage.setItem(tokenType.REFRESH, token);
}

export function removeAccessToken() {
  localStorage.removeItem(tokenType.ACCESS);
}

export function removeRefreshToken() {
  localStorage.removeItem(tokenType.REFRESH);
}

export function getTokenPayload(token, options) {
  const { iss, aud, iat, jti, exp, ...data } = jwtDecode(token, options);
  return data;
}

export function isExpired(token) {
  const { exp } = jwtDecode(token);
  return exp * 1000 < Date.now();
}
