vi.mock("./http.js", () => ({
  default: {
    delete: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
  },
}));

import apiClient from "./http.js";
import { changePasswordRequest, connectDiscordAccountRequest, deleteMyAccountRequest, getDiscordAuthorizeUrlRequest, getMyInfoRequest, getNotificationSettingsRequest, updateMyInfoRequest, updateNotificationSettingsRequest } from "./userApi.js";

beforeEach(() => {
  vi.clearAllMocks();
  apiClient.delete.mockResolvedValue({ data: {} });
  apiClient.get.mockResolvedValue({ data: {} });
  apiClient.patch.mockResolvedValue({ data: {} });
  apiClient.post.mockResolvedValue({ data: {} });
});

describe("userApi", () => {
  it("getMyInfoRequest는 내 정보 GET 요청을 전달한다", async () => {
    await getMyInfoRequest();

    expect(apiClient.get).toHaveBeenCalledWith("/users/me");
  });

  it("updateMyInfoRequest는 사용자 수정 FormData를 PATCH 요청으로 전달한다", async () => {
    const formData = new FormData();

    await updateMyInfoRequest(formData);

    expect(apiClient.patch).toHaveBeenCalledWith("/users/me", formData);
  });

  it("changePasswordRequest는 비밀번호 변경 데이터를 PATCH 요청으로 전달한다", async () => {
    const data = {
      currentPassword: "Current1!",
      newPassword: "Newpass1!",
    };

    await changePasswordRequest(data);

    expect(apiClient.patch).toHaveBeenCalledWith("/users/me/password", data);
  });

  it("deleteMyAccountRequest는 회원 탈퇴 DELETE 요청을 전달한다", async () => {
    await deleteMyAccountRequest();

    expect(apiClient.delete).toHaveBeenCalledWith("/users/me");
  });

  it("getNotificationSettingsRequest는 알림 설정 GET 요청을 전달한다", async () => {
    await getNotificationSettingsRequest();

    expect(apiClient.get).toHaveBeenCalledWith(
      "/users/me/notification-settings",
    );
  });

  it("updateNotificationSettingsRequest는 알림 설정을 PATCH 요청으로 전달한다", async () => {
    const data = { categories: ["FRONTEND", "CS"] };

    await updateNotificationSettingsRequest(data);

    expect(apiClient.patch).toHaveBeenCalledWith(
      "/users/me/notification-settings",
      data,
    );
  });

  it("getDiscordAuthorizeUrlRequest는 Discord 인증 URL GET 요청을 전달한다", async () => {
    await getDiscordAuthorizeUrlRequest();

    expect(apiClient.get).toHaveBeenCalledWith(
      "/users/me/discord/authorize-url",
    );
  });

  it("connectDiscordAccountRequest는 code와 state를 POST 요청으로 전달한다", async () => {
    await connectDiscordAccountRequest("discord-code", "csrf-state");

    expect(apiClient.post).toHaveBeenCalledWith("/users/me/discord/connect", {
      code: "discord-code",
      state: "csrf-state",
    });
  });
});
