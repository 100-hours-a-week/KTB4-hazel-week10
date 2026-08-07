

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserEditForm from "./UserEditForm.jsx";

const user = {
  email: "hazel@example.com",
  nickname: "hazel",
};

describe("UserEditForm", () => {
  it("이메일, 닉네임, 프로필 이미지 입력과 수정 버튼을 표시한다", () => {
    render(
      <UserEditForm
        user={user}
        profileImageUrl="/profiles/hazel.png"
        nicknameError=""
        isSubmitting={false}
        onNicknameChange={vi.fn()}
        onProfileImageChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByText("hazel@example.com")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "닉네임*" })).toHaveValue("hazel");
    expect(screen.getByRole("img", { name: "프로필 사진" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "수정하기" })).toBeEnabled();
  });

  it("닉네임 변경과 프로필 이미지 선택을 각각 callback으로 전달한다", async () => {
    const userEventInstance = userEvent.setup();
    const onNicknameChange = vi.fn();
    const onProfileImageChange = vi.fn();
    const { container } = render(
      <UserEditForm
        user={user}
        profileImageUrl="/profiles/hazel.png"
        nicknameError=""
        isSubmitting={false}
        onNicknameChange={onNicknameChange}
        onProfileImageChange={onProfileImageChange}
        onSubmit={vi.fn()}
      />,
    );

    const nicknameInput = screen.getByRole("textbox", { name: "닉네임*" });
    await userEventInstance.clear(nicknameInput);
    await userEventInstance.type(nicknameInput, "new-hazel");

    const imageInput = container.querySelector('input[type="file"]');
    await userEventInstance.upload(
      imageInput,
      new File(["image"], "profile.png", { type: "image/png" }),
    );

    expect(onNicknameChange).toHaveBeenCalled();
    expect(onProfileImageChange).toHaveBeenCalledTimes(1);
  });

  it("수정 버튼을 누르면 폼 제출을 전달하고 제출 중에는 비활성화된다", async () => {
    const userEventInstance = userEvent.setup();
    const onSubmit = vi.fn((event) => event.preventDefault());

    const { rerender } = render(
      <UserEditForm
        user={user}
        profileImageUrl="/profiles/hazel.png"
        nicknameError=""
        isSubmitting={false}
        onNicknameChange={vi.fn()}
        onProfileImageChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await userEventInstance.click(screen.getByRole("button", { name: "수정하기" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);

    rerender(
      <UserEditForm
        user={user}
        profileImageUrl="/profiles/hazel.png"
        nicknameError="닉네임 오류"
        isSubmitting
        onNicknameChange={vi.fn()}
        onProfileImageChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.getByRole("button", { name: "수정 중..." })).toBeDisabled();
    expect(screen.getByText("* 닉네임 오류")).toBeInTheDocument();
  });
});
