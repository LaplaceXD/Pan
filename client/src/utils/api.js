const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL;

async function parsedResponse(res) {
  const data = await res.json();
  return { status: res.status, error: data?.error ?? null, message: data?.message ?? null, data };
}

async function get(path, { token = null, signal = null }) {
  let headers = {};
  if (token !== null) headers = { ...headers, Authorization: `Bearer ${token}` };

  const res = await fetch(`${SERVER_BASE_URL}${path}`, {
    signal,
    headers,
  });

  return parsedResponse(res);
}

async function post(path, body, { token = null, signal = null }) {
  let headers = { "Content-Type": "application/json" };
  if (token !== null) headers = { ...headers, Authorization: `Bearer ${token}` };

  const res = await fetch(`${SERVER_BASE_URL}${path}`, {
    method: "POST",
    headers,
    signal,
    body: JSON.stringify(body),
  });

  return parsedResponse(res);
}

async function put(path, body, { token = null, signal = null }) {
  let headers = { "Content-Type": "application/json" };
  if (token !== null) headers = { ...headers, Authorization: `Bearer ${token}` };

  const res = await fetch(`${SERVER_BASE_URL}${path}`, {
    method: "PUT",
    headers,
    signal,
    body: JSON.stringify(body),
  });

  return parsedResponse(res);
}

async function del(path, { token = null, signal = null }) {
  let headers = {};
  if (token !== null) headers = { ...headers, Authorization: `Bearer ${token}` };

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
