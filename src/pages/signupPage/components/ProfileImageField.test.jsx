/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ProfileImageField from "./ProfileImageField.jsx";

describe("ProfileImageField", () => {
  it("프로필 사진 입력과 기본 미리보기 버튼을 표시한다", () => {
    const { container } = render(
      <ProfileImageField
        previewUrl=""
        errorMessage=""
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText("프로필 사진")).toBeInTheDocument();
    expect(screen.getByText("+")).toBeInTheDocument();
    expect(container.querySelector('input[type="file"]')).toHaveAttribute(
      "accept",
      "image/*",
    );
  });

  it("오류 메시지를 표시하고 잘못된 입력 상태를 노출한다", () => {
    const { container } = render(
      <ProfileImageField
        previewUrl=""
        errorMessage="프로필 사진을 선택해주세요."
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText("* 프로필 사진을 선택해주세요.")).toBeInTheDocument();
    expect(container.querySelector('input[type="file"]')).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("미리보기 URL이 있으면 더하기 표시를 숨기고 파일 변경을 전달한다", () => {
    const onChange = vi.fn();
    const { container } = render(
      <ProfileImageField
        previewUrl="blob:http://localhost/profile"
        errorMessage=""
        onChange={onChange}
      />,
    );
    const input = container.querySelector('input[type="file"]');

    fireEvent.change(input, {
      target: {
        files: [new File(["image"], "profile.png", { type: "image/png" })],
      },
    });

    expect(screen.queryByText("+")).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
