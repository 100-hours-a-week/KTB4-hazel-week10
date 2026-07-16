import { request } from "./http.js";

export function loginRequest(data) {
  return request("/users/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function signupRequest(data) {
  return request("/users/signup", {
    method: "POST",
    body: data,
  });
}

export function logoutRequest() {
  return request("/users/logout", {
    method: "POST",
  });
}
