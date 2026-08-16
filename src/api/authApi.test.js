vi.mock("./http.js", () => ({
  default: {
    post: vi.fn(),
  },
}));

import apiClient from "./http.js";
import { loginRequest, logoutRequest, signupRequest } from "./authApi.js";

beforeEach(() => {
  vi.clearAllMocks();
  apiClient.post.mockResolvedValue({ data: {} });
});

describe("authApi", () => {
  it("loginRequest는 로그인 정보를 POST 요청으로 전달한다", async () => {
    const data = {
      email: "hazel@example.com",
      password: "Password1!",
    };

    await loginRequest(data);

    expect(apiClient.post).toHaveBeenCalledWith("/users/login", data);
  });

  it("signupRequest는 회원가입 FormData를 POST 요청으로 전달한다", async () => {
    const formData = new FormData();
    formData.append("email", "hazel@example.com");

    await signupRequest(formData);

    expect(apiClient.post).toHaveBeenCalledWith("/users/signup", formData);
  });

  it("logoutRequest는 로그아웃 POST 요청을 전달한다", async () => {
    await logoutRequest();

    expect(apiClient.post).toHaveBeenCalledWith("/users/logout");
  });
});
