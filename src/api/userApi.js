import { request } from "./http.js";

export function getMyInfoRequest() {
  return request("/users/me", {
    method : "GET",
  })
}

export function updateMyInfoRequest(data) {
  return request("/users/me", {
    method: "PATCH",
    body: data
  })
}

export function changePasswordRequest(data) {
  return request("/users/me/password", {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function deleteMyAccountRequest() {
  return request("/users/me", {
    method: "DELETE",
  });
}

export function getNotificationSettingsRequest() {
  return request("/users/me/notification-settings", {
    method: "GET",
  });
}

export function updateNotificationSettingsRequest(data) {
  return request("/users/me/notification-settings", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function getDiscordAuthorizeUrlRequest() {
  return request("/users/me/discord/authorize-url", {
    method: "GET",
  });
}

export function connectDiscordAccountRequest(code) {
  return request("/users/me/discord/connect", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}
