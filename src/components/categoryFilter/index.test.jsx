

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryFilter from "./index.jsx";

describe("CategoryFilter", () => {
  it("전체와 모든 카테고리 버튼을 표시한다", () => {
    render(<CategoryFilter value="" onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "전체" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "FE" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "BE" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "CS" })).toBeInTheDocument();
  });

  it.each([
    ["전체", ""],
    ["FE", "FRONTEND"],
    ["BE", "BACKEND"],
    ["CS", "CS"],
  ])("%s를 클릭하면 해당 카테고리 값으로 onChange를 호출한다", async (label, value) => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<CategoryFilter value="" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: label }));

    expect(onChange).toHaveBeenCalledWith(value);
  }); 
});
