const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL;
const DEFAULT_OPTIONS = { token: null, signal: null };

async function parsedResponse(res) {
  let data = null;

  if (res.status !== 204) {
    data = await res.json();
  }

  return {
    status: res.status,
    error: res.status >= 400,
    message: data?.message ?? null,
    data,
  };
}

async function get(path, { token = null, signal = null } = DEFAULT_OPTIONS) {
  let headers = {};
  if (token) headers = { ...headers, Authorization: `Bearer ${token}` };

  const res = await fetch(`${SERVER_BASE_URL}${path}`, {
    signal,
    headers,
  });

  return parsedResponse(res);
}

async function post(path, body, { token = null, signal = null } = DEFAULT_OPTIONS) {
  let headers = { "Content-Type": "application/json" };
  if (token) headers = { ...headers, Authorization: `Bearer ${token}` };

  const res = await fetch(`${SERVER_BASE_URL}${path}`, {
    method: "POST",
    headers,
    signal,
    body: JSON.stringify(typeof body === "function" ? body() : body),
  });

  return parsedResponse(res);
}

async function put(path, body, { token = null, signal = null } = DEFAULT_OPTIONS) {
  let headers = { "Content-Type": "application/json" };
  if (token) headers = { ...headers, Authorization: `Bearer ${token}` };

  const res = await fetch(`${SERVER_BASE_URL}${path}`, {
    method: "PUT",
    headers,
    signal,
    body: JSON.stringify(typeof body === "function" ? body() : body),
  });

  return parsedResponse(res);
}

async function del(path, { token = null, signal = null } = DEFAULT_OPTIONS) {
  let headers = {};
  if (token) headers = { ...headers, Authorization: `Bearer ${token}` };

  const res = await fetch(`${SERVER_BASE_URL}${path}`, {
    method: "DELETE",
    signal,
    headers,
  });

  return parsedResponse(res);
}

export default {
  get,
  post,
  put,
  delete: del,
};
