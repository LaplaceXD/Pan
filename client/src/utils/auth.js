import api from "./api";
import token from "./token";

const UNAUTHORIZED = 401;
const SUCCESS = 200;
const DEFAULT_RESPONSE = { status: UNAUTHORIZED, error: "You are unauthorized to access this resource." };
const DEFAULT_OPTIONS = { signal: null, parsed: true };

async function refreshTokens({ access, refresh }, signal) {
  return api.post("/auth/refresh", { access, refresh }, { signal });
}

async function revalidateSession({ access, refresh }, signal) {
  const { status, data: tokens } = await refreshTokens({ access, refresh }, signal);

  if (status !== SUCCESS) {
    token.pair.remove();
    return false;
  }

  token.pair.set({ access: tokens.access, refresh: tokens.refresh });
  return true;
}

async function get(path, { signal = null, parsed = true } = DEFAULT_OPTIONS) {
  const { access, refresh } = token.pair.get();
  if (!access || !refresh) return DEFAULT_RESPONSE;

  let response = await api.get(path, { token: access, signal, parsed });

  if (response.status === UNAUTHORIZED) {
    const successfulRevalidation = await revalidateSession({ access, refresh }, signal);
    if (!successfulRevalidation) return DEFAULT_RESPONSE;

    response = await get(path, { signal, parsed });
  }

  return response;
}

async function post(path, body, { signal = null, parsed = true } = DEFAULT_OPTIONS) {
  const { access, refresh } = token.pair.get();
  if (!access || !refresh) return DEFAULT_RESPONSE;

  let response = await api.post(path, body, { token: access, signal, parsed });

  if (response.status === UNAUTHORIZED) {
    const successfulRevalidation = await revalidateSession({ access, refresh }, signal);
    if (!successfulRevalidation) return DEFAULT_RESPONSE;

    response = await post(path, body, { signal, parsed });
  }

  return response;
}

async function put(path, body, { signal = null, parsed = true } = DEFAULT_OPTIONS) {
  const { access, refresh } = token.pair.get();
  if (!access || !refresh) return DEFAULT_RESPONSE;

  let response = await api.put(path, body, { token: access, signal, parsed });

  if (response.status === UNAUTHORIZED) {
    const successfulRevalidation = await revalidateSession({ access, refresh }, signal);
    if (!successfulRevalidation) return DEFAULT_RESPONSE;

    response = await put(path, body, { signal, parsed });
  }

  return response;
}

async function del(path, { signal = null, parsed = true } = DEFAULT_OPTIONS) {
  const { access, refresh } = token.pair.get();
  if (!access || !refresh) return DEFAULT_RESPONSE;

  let response = await api.delete(path, { token: access, signal, parsed });

  if (response.status === UNAUTHORIZED) {
    const successfulRevalidation = await revalidateSession({ access, refresh }, signal);
    if (!successfulRevalidation) return DEFAULT_RESPONSE;

    response = await del(path, { signal, parsed });
  }

  return response;
}

export default {
  get,
  post,
  put,
  delete: del,
};
