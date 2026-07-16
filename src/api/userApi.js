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
