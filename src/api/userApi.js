import apiClient from "./http.js";

export async function getMyInfoRequest() {
  const response = await apiClient.get("/users/me");

  return response.data;
}

export async function updateMyInfoRequest(data) {
  const response = await apiClient.patch("/users/me", data);

  return response.data;
}

export async function changePasswordRequest(data) {
  const response = await apiClient.patch("/users/me/password", data);

  return response.data;
}

export async function deleteMyAccountRequest() {
  const response = await apiClient.delete("/users/me");

  return response.data;
}

export async function getNotificationSettingsRequest() {
  const response = await apiClient.get("/users/me/notification-settings");

  return response.data;
}

export async function updateNotificationSettingsRequest(data) {
  const response = await apiClient.patch(
    "/users/me/notification-settings",
    data,
  );

  return response.data;
}

export async function getDiscordAuthorizeUrlRequest() {
  const response = await apiClient.get("/users/me/discord/authorize-url");

  return response.data;
}

export async function connectDiscordAccountRequest(code, state) {
  const response = await apiClient.post("/users/me/discord/connect", {
    code,
    state,
  });

  return response.data;
}
