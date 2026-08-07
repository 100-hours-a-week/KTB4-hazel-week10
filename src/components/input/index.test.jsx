/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "./index.jsx";

describe("Input", () => {
  it("라벨과 필수 입력 상태를 렌더링한다", () => {
    render(
      <Input
        id="email"
        name="email"
        label="이메일"
        type="email"
        required
        value=""
        onChange={vi.fn()}
      />,
    );

    const input = screen.getByLabelText("이메일*");

    expect(input).toHaveAttribute("type", "email");
    expect(input).toBeRequired();
  });

  it("사용자가 입력하면 onChange를 호출한다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Input
        id="email"
        name="email"
        label="이메일"
        value=""
        onChange={onChange}
      />,
    );

    await user.type(screen.getByLabelText("이메일"), "h");

    expect(onChange).toHaveBeenCalled();
  });

  it("helper 메시지를 표시한다", () => {
    render(
      <Input
        id="email"
        name="email"
        label="이메일"
        helperText="이메일을 입력해주세요."
        value=""
        onChange={vi.fn()}
      />,
    );

    expect(
      screen.getByText("* 이메일을 입력해주세요."),
    ).toBeInTheDocument();
  });
});
