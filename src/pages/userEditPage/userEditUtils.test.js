import { clearAuthData, createUserEditFormData } from "./userEditUtils.js";

const PROFILE_IMAGE = new File(["profile"], "profile.png", {
  type: "image/png",
});

describe("createUserEditFormData", () => {
  it("닉네임과 프로필 이미지를 FormData에 담는다", () => {
    const formData = createUserEditFormData("hazel", PROFILE_IMAGE);

    expect(formData.get("nickname")).toBe("hazel");
    expect(formData.get("profileImage")).toBe(PROFILE_IMAGE);
  });

  it("프로필 이미지가 없으면 nickname만 FormData에 담는다", () => {
    const formData = createUserEditFormData("hazel", null);

    expect([...formData.keys()]).toEqual(["nickname"]);
  });
});

describe("clearAuthData", () => {
  it("저장된 인증 데이터를 모두 삭제한다", () => {
    localStorage.setItem("accessToken", "access-token");
    localStorage.setItem("tokenType", "Bearer");
    localStorage.setItem("userId", "1");

    clearAuthData();

    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("tokenType")).toBeNull();
    expect(localStorage.getItem("userId")).toBeNull();
  });
});
