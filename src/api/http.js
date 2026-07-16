export const BASE_URL = "http://localhost:8080";

let refreshPromise = null;

function clearSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("tokenType");
  localStorage.removeItem("userId");
}

function goToLogin() {
  clearSession();
  location.href = "../loginPage/login.html";
}

// accessToken 재발급. 동시에 여러 요청이 401을 맞아도 재발급은 한 번만 나가도록
// 진행 중인 Promise를 공유한다 (refreshToken 로테이션과 겹치면 서로를 무효화하기 때문).
function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/users/token/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("토큰 재발급 실패");
        }

        const result = await response.json();
        const accessToken = result.data.accessToken;

        localStorage.setItem("accessToken", accessToken);

        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function request(path, options = {}, isRetry = false) {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    if (isRetry) {
      goToLogin();
      return;
    }

    try {
      await refreshAccessToken();
    } catch (error) {
      goToLogin();
      return;
    }

    return request(path, options, true);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "API 요청 실패");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
