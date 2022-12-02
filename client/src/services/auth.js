const endpoint = `${import.meta.env.VITE_SERVER_URL}/auth`;

export async function loginEmployee({ email, password }) {
  const response = await fetch(`${endpoint}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return data;
}
