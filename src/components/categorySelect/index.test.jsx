import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategorySelect from "./index.jsx";

describe("CategorySelect", () => {
  it("선택된 값이 없으면 placeholder를 표시한다", () => {
    render(
      <CategorySelect
        id="category"
        value=""
        onChange={vi.fn()}
      />,
    );

    const trigger = screen.getByRole("button", {
      name: "카테고리를 선택해주세요",
    });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("trigger를 클릭하면 카테고리 목록을 연다", async () => {
    const user = userEvent.setup();

    render(
      <CategorySelect
        id="category"
        value=""
        onChange={vi.fn()}
      />,
    );

    const trigger = screen.getByRole("button", {
      name: "카테고리를 선택해주세요",
    });

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "FE", exact: true })).toBeInTheDocument();
  });

  it("카테고리를 선택하면 name과 value를 담아 onChange를 호출하고 목록을 닫는다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <CategorySelect
        id="category"
        name="boardCategory"
        value=""
        onChange={onChange}
      />,
    );

    const trigger = screen.getByRole("button", {
      name: "카테고리를 선택해주세요",
    });

    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "BE", exact: true }));

    expect(onChange).toHaveBeenCalledWith({
      target: {
        name: "boardCategory",
        value: "BACKEND",
      },
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("목록 바깥을 클릭하면 목록을 닫는다", async () => {
    const user = userEvent.setup();

    render(
      <CategorySelect
        id="category"
        value=""
        onChange={vi.fn()}
      />,
    );

    const trigger = screen.getByRole("button", {
      name: "카테고리를 선택해주세요",
    });

    await user.click(trigger);
    await user.click(document.body);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
