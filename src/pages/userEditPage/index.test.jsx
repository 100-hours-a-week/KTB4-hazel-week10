// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/api/authApi.js", () => ({
  logoutRequest: vi.fn(),
}));

vi.mock("@/api/userApi.js", () => ({
  deleteMyAccountRequest: vi.fn(),
  getMyInfoRequest: vi.fn(),
  updateMyInfoRequest: vi.fn(),
}));

import { deleteMyAccountRequest, getMyInfoRequest } from "@/api/userApi.js";
import UserEditPage from "./index.jsx";

function LocationProbe() {
  const { pathname } = useLocation();

  return <output aria-label="현재 경로">{pathname}</output>;
}

function renderUserEditPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/users/edit"]}>
        <Routes>
          <Route path="/users/edit" element={<UserEditPage />} />
          <Route path="/login" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  getMyInfoRequest.mockResolvedValue({
    data: {
      email: "hazel@example.com",
      nickname: "hazel",
      profileImage: "",
    },
  });
  deleteMyAccountRequest.mockResolvedValue(undefined);
});

async function openWithdrawModal(user) {
  renderUserEditPage();

  await waitFor(() => {
    expect(screen.getByRole("button", { name: "회원 탈퇴" })).toBeInTheDocument();
  });

  await user.click(screen.getByRole("button", { name: "회원 탈퇴" }));
}

describe("UserEditPage", () => {
  it("회원 탈퇴 버튼을 누르면 확인 모달을 열고 확인 시 탈퇴 처리한다", async () => {
    const user = userEvent.setup();

    await openWithdrawModal(user);

    expect(
      screen.getByRole("dialog", { name: "회원 탈퇴하시겠습니까?" }),
    ).toHaveTextContent("탈퇴한 계정은 복구할 수 없습니다.");
    expect(deleteMyAccountRequest).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "확인" }));

    await waitFor(() => {
      expect(deleteMyAccountRequest).toHaveBeenCalledTimes(1);
      expect(screen.getByLabelText("현재 경로")).toHaveTextContent("/login");
    });
  });

  it("회원 탈퇴 모달에서 취소하면 탈퇴하지 않는다", async () => {
    const user = userEvent.setup();

    await openWithdrawModal(user);
    await user.click(screen.getByRole("button", { name: "취소" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(deleteMyAccountRequest).not.toHaveBeenCalled();
  });
});
