/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
vi.mock("@/api/authApi.js", () => ({
  logoutRequest: vi.fn(),
}));

vi.mock("@/api/userApi.js", () => ({
  getMyInfoRequest: vi.fn(),
}));

import { logoutRequest } from "@/api/authApi.js";
import { getMyInfoRequest } from "@/api/userApi.js";
import Header from "./index.jsx";

function LocationProbe() {
  const { pathname } = useLocation();

  return <output aria-label="현재 경로">{pathname}</output>;
}

function renderHeader(type = "default", initialEntries = ["/"]) {
  return render(
    <MemoryRouter
      initialEntries={initialEntries}
      initialIndex={initialEntries.length - 1}
    >
      <Routes>
        <Route
          path="*"
          element={
            <>
              <Header type={type} />
              <LocationProbe />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  logoutRequest.mockResolvedValue(undefined);
  getMyInfoRequest.mockResolvedValue({ data: {} });
});

describe("Header", () => {
  it("제목을 클릭하면 게시판으로 이동한다", async () => {
    const user = userEvent.setup();

    renderHeader();

    await user.click(screen.getByRole("link", { name: "작심삼일" }));

    expect(screen.getByLabelText("현재 경로")).toHaveTextContent("/boards");
  });

  it("뒤로가기 버튼을 클릭하면 이전 경로로 이동한다", async () => {
    const user = userEvent.setup();

    renderHeader("withBack", ["/previous", "/current"]);

    await user.click(screen.getByRole("button", { name: "뒤로가기" }));

    expect(screen.getByLabelText("현재 경로")).toHaveTextContent("/previous");
  });

  it("프로필 버튼을 클릭하면 프로필 메뉴를 열고 회원정보 수정으로 이동한다", async () => {
    const user = userEvent.setup();

    renderHeader("withProfile");

    const profileButton = screen.getByRole("button", { name: "프로필 메뉴" });

    expect(profileButton).toHaveAttribute("aria-expanded", "false");

    await user.click(profileButton);

    expect(profileButton).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("button", { name: "회원정보수정" }));

    expect(screen.getByLabelText("현재 경로")).toHaveTextContent("/users/edit");
  });

  it("로그아웃하면 세션 정보를 지우고 로그인 페이지로 이동한다", async () => {
    const user = userEvent.setup();

    localStorage.setItem("accessToken", "access-token");
    localStorage.setItem("tokenType", "Bearer");
    localStorage.setItem("userId", "1");

    renderHeader("withProfile");

    await user.click(screen.getByRole("button", { name: "프로필 메뉴" }));
    await user.click(screen.getByRole("button", { name: "로그아웃" }));

    await waitFor(() => {
      expect(logoutRequest).toHaveBeenCalledTimes(1);
      expect(screen.getByLabelText("현재 경로")).toHaveTextContent("/login");
    });

    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("tokenType")).toBeNull();
    expect(localStorage.getItem("userId")).toBeNull();
  });
});
