vi.mock("./http.js", () => ({
  request: vi.fn(),
}));

import { request } from "./http.js";
import {
  changePasswordRequest,
  connectDiscordAccountRequest,
  deleteMyAccountRequest,
  getDiscordAuthorizeUrlRequest,
  getMyInfoRequest,
  getNotificationSettingsRequest,
  updateMyInfoRequest,
  updateNotificationSettingsRequest,
} from "./userApi.js";

beforeEach(() => {
  vi.clearAllMocks();
  request.mockResolvedValue({ data: {} });
});

describe("userApi", () => {
  it("getMyInfoRequest는 내 정보 GET 요청을 전달한다", async () => {
    await getMyInfoRequest();

    expect(request).toHaveBeenCalledWith("/users/me", {
      method: "GET",
    });
  });

  it("updateMyInfoRequest는 사용자 수정 FormData를 PATCH 요청으로 전달한다", async () => {
    const formData = new FormData();

    await updateMyInfoRequest(formData);

    expect(request).toHaveBeenCalledWith("/users/me", {
      method: "PATCH",
      body: formData,
    });
  });

  it("changePasswordRequest는 비밀번호 변경 데이터를 JSON PATCH 요청으로 전달한다", async () => {
    const data = {
      currentPassword: "Current1!",
      newPassword: "Newpass1!",
    };

    await changePasswordRequest(data);

    expect(request).toHaveBeenCalledWith("/users/me/password", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  });

  it("deleteMyAccountRequest는 회원 탈퇴 DELETE 요청을 전달한다", async () => {
    await deleteMyAccountRequest();

    expect(request).toHaveBeenCalledWith("/users/me", {
      method: "DELETE",
    });
  });

  it("getNotificationSettingsRequest는 알림 설정 GET 요청을 전달한다", async () => {
    await getNotificationSettingsRequest();

    expect(request).toHaveBeenCalledWith("/users/me/notification-settings", {
      method: "GET",
    });
  });

  it("updateNotificationSettingsRequest는 알림 설정을 JSON PATCH 요청으로 전달한다", async () => {
    const data = { categories: ["FRONTEND", "CS"] };

    await updateNotificationSettingsRequest(data);

    expect(request).toHaveBeenCalledWith("/users/me/notification-settings", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  });

  it("getDiscordAuthorizeUrlRequest는 Discord 인증 URL GET 요청을 전달한다", async () => {
    await getDiscordAuthorizeUrlRequest();

    expect(request).toHaveBeenCalledWith("/users/me/discord/authorize-url", {
      method: "GET",
    });
  });

  it("connectDiscordAccountRequest는 code와 state를 JSON POST 요청으로 전달한다", async () => {
    await connectDiscordAccountRequest("discord-code", "csrf-state");

    expect(request).toHaveBeenCalledWith("/users/me/discord/connect", {
      method: "POST",
      body: JSON.stringify({ code: "discord-code", state: "csrf-state" }),
    });
  });
});
