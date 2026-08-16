import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

let refreshPromise = null;

function clearSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("tokenType");
  localStorage.removeItem("userId");
}

function redirectToLogin() {
  clearSession();
  window.location.href = "/login";
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${BASE_URL}/users/token/refresh`,
        null,
        { withCredentials: true },
      )
      .then((response) => {
        const accessToken = response.data?.data?.accessToken;

        if (!accessToken) {
          throw new Error("토큰 재발급 실패");
        }

        localStorage.setItem("accessToken", accessToken);

        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isRefreshRequest = originalRequest?.url?.includes(
      "/users/token/refresh",
    );

    if (status !== 401 || !originalRequest || originalRequest._retry || isRefreshRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const accessToken = await refreshAccessToken();

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      redirectToLogin();

      return Promise.reject(
        new Error("세션이 만료되었습니다.", { cause: refreshError }),
      );
    }
  },
);

export default apiClient;
