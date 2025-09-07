const API_BASE_URL = "https://appointmentbooking-zen4.onrender.com/api/v1";

export function setTokens(access, refresh, userId) {
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
  localStorage.setItem("user", userId);
}

export function getTokens() {
  return {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken")
  };
}


async function request(endpoint, method = "GET", data = null, auth = false) {
  const { accessToken, refreshToken } = getTokens(); 
  const headers = { "Content-Type": "application/json" };
  if (auth && accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const options = { method, headers };
  if (data) options.body = JSON.stringify(data);

  let response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  // If token expired → try refresh
  if (response.status === 401 && refreshToken) {
    const refreshRes = await fetch(`${API_BASE_URL}/users/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });

    if (refreshRes.ok) {
      const tokens = await refreshRes.json();
      setTokens(tokens.data.accessToken, tokens.data.refreshToken);
      headers["Authorization"] = `Bearer ${tokens.data.accessToken}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, options); // retry
    }
  }

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Request failed");
  }

  return response.json();
}

export default request;
