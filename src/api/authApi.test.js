vi.mock("./http.js", () => ({
  request: vi.fn(),
}));

import { request } from "./http.js";
import { loginRequest, logoutRequest, signupRequest } from "./authApi.js";

beforeEach(() => {
  vi.clearAllMocks();
  request.mockResolvedValue({ data: {} });
});

describe("authApi", () => {
  it("loginRequest는 로그인 정보를 POST 요청으로 전달한다", async () => {
    const data = {
      email: "hazel@example.com",
      password: "Password1!",
    };

    await loginRequest(data);

    expect(request).toHaveBeenCalledWith("/users/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("signupRequest는 회원가입 FormData를 POST 요청으로 전달한다", async () => {
    const formData = new FormData();
    formData.append("email", "hazel@example.com");

    await signupRequest(formData);

    expect(request).toHaveBeenCalledWith("/users/signup", {
      method: "POST",
      body: formData,
    });
  });

  it("logoutRequest는 로그아웃 POST 요청을 전달한다", async () => {
    await logoutRequest();

    expect(request).toHaveBeenCalledWith("/users/logout", {
      method: "POST",
    });
  });
});
