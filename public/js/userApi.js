import request, { setTokens } from "./api.js";

export async function registerUser(data) {
  return request("/users/register", "POST", data);
}

export async function loginUser(data) {
  const res = await request("/users/login", "POST", data);
  setTokens(res.message.accessToken, res.message.refreshToken, res.message.user._id);
  return res;
}

export async function getCurrentUser() {
  return request("/users/current-user", "GET", null, true);
}

export async function logoutUsers() {
  return request("/users/logout", "POST", null, true);
}

export async function updateAccountDetails(data) {
  return request("/users/update-profile", "PATCH", data, true);
}

export async function changePassword(data) {
  return request("/users/change-password", "POST", data, true);
}

export async function getNotifications() {
  return request("/users/notifications", "GET", null, true);
}

export async function getUserById(id) {
  return request(`/users/${id}`, "GET");
}

export async function deleteNotifications() {
  return request("/users/notifications", "DELETE", null, true);
}