const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL;

async function parsedResponse(response) {
  const data = await response.json();
  return { status: res.status, error: data?.error ?? null, message: data?.message ?? null, data };
}

async function get(path, token = null) {
  let headers = {};
  if (token !== null) headers = { ...headers, Authorization: `Bearer ${token}` };

  const res = await fetch(`${SERVER_BASE_URL}${path}`, {
    headers,
  });

  return parsedResponse(res);
}

async function post(path, body, token = null) {
  let headers = { "Content-Type": "application/json" };
  if (token !== null) headers = { ...headers, Authorization: `Bearer ${token}` };

  const res = await fetch(`${SERVER_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  return parsedResponse(res);
}

async function put(path, body, token = null) {
  let headers = { "Content-Type": "application/json" };
  if (token !== null) headers = { ...headers, Authorization: `Bearer ${token}` };

  const res = await fetch(`${SERVER_BASE_URL}${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });

  return parsedResponse(res);
}

async function del(path, token = null) {
  let headers = {};
  if (token !== null) headers = { ...headers, Authorization: `Bearer ${token}` };

  const res = await fetch(`${SERVER_BASE_URL}${path}`, {
    method: "DELETE",
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
