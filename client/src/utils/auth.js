import api from "./api";
import token from "./token";

const UNAUTHORIZED = 401;
const SUCCESS = 200;
const DEFAULT_RESPONSE = { status: UNAUTHORIZED, error: "You are unauthorized to access this resource." };

async function refreshTokens({ access, refresh }) {
  return api.post("/auth/refresh", { access, refresh });
}

async function revalidateSession({ access, refresh }) {
  const { status, data: tokens } = await refreshTokens({ access, refresh });
  if (status !== SUCCESS) return false;

  token.pair.set({ access: tokens.access, refresh: tokens.refresh });
  return true;
}

async function get(path) {
  const { access, refresh } = token.pair.get();
  if (!access || !refresh) return DEFAULT_RESPONSE;

  let response = await api.get(path, access);

  if (response.status === UNAUTHORIZED) {
    const successfulRevalidation = revalidateSession({ access, refresh });
    if (!successfulRevalidation) return DEFAULT_RESPONSE;

    response = await get(path);
  }

  return response;
}

async function post(path, body) {
  const { access, refresh } = token.pair.get();
  if (!access || !refresh) return DEFAULT_RESPONSE;

  let response = await api.post(path, body, access);

  if (response.status === UNAUTHORIZED) {
    const successfulRevalidation = revalidateSession({ access, refresh });
    if (!successfulRevalidation) return DEFAULT_RESPONSE;

    response = await post(path, body);
  }

  return response;
}

async function put(path, body) {
  const { access, refresh } = token.pair.get();
  if (!access || !refresh) return DEFAULT_RESPONSE;

  let response = await api.put(path, body, access);

  if (response.status === UNAUTHORIZED) {
    const successfulRevalidation = revalidateSession({ access, refresh });
    if (!successfulRevalidation) return DEFAULT_RESPONSE;

    response = await put(path, body);
  }

  return response;
}

async function del(path) {
  const { access, refresh } = token.pair.get();
  if (!access || !refresh) return DEFAULT_RESPONSE;

  let response = await api.delete(path, access);

  if (response.status === UNAUTHORIZED) {
    const successfulRevalidation = revalidateSession({ access, refresh });
    if (!successfulRevalidation) return DEFAULT_RESPONSE;

    response = await del(path);
  }

  return response;
}

export default {
  get,
  post,
  put,
  delete: del,
};
