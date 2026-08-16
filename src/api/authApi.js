import apiClient from "./http.js";

export async function loginRequest(data) {
  const response = await apiClient.post("/users/login", data); 
  return response.data;
}

export async function signupRequest(data) {
  const response = await apiClient.post("/users/signup", data);
  return response.data;
}

export async function logoutRequest() { 
  const response = await apiClient.post("/users/logout");
  return response.data;
}
