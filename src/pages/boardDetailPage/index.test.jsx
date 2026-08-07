// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

vi.mock("../../api/boardApi.js", () => ({
  cancelVoteRequest: vi.fn(),
  deleteBoardRequest: vi.fn(),
  voteBoardRequest: vi.fn(),
}));

vi.mock("../../api/commentApi.js", () => ({
  createCommentRequest: vi.fn(),
  deleteCommentRequest: vi.fn(),
  updateCommentRequest: vi.fn(),
}));

vi.mock("../../api/userApi.js", () => ({
  getMyInfoRequest: vi.fn(),
}));

vi.mock("./hooks/useBoardDetail.js", () => ({
  default: vi.fn(),
}));

import { deleteBoardRequest } from "../../api/boardApi.js";
import { getMyInfoRequest } from "../../api/userApi.js";
import useBoardDetail from "./hooks/useBoardDetail.js";
import BoardDetailPage from "./index.jsx";

const post = {
  category: "BACKEND",
  title: "API 응답을 확인하고 싶어요",
  writer: "hazel",
  createdAt: "2026-08-07T12:30:45.123Z",
  writerProfileImage: "",
  images: [],
  isOwner: true,
  text: "응답 형식에 대한 질문입니다.",
  likeCount: 4,
  views: 22,
  comments: 3,
  agreeCount: 7,
  disagreeCount: 2,
  myVoteType: "AGREE",
};

function LocationProbe() {
  const { pathname } = useLocation();

  return <output aria-label="현재 경로">{pathname}</output>;
}

function renderBoardDetailPage() {
  return render(
    <MemoryRouter initialEntries={["/boards/42"]}>
      <Routes>
        <Route path="/boards/:postId" element={<BoardDetailPage />} />
        <Route
          path="/boards"
          element={<LocationProbe />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  useBoardDetail.mockReturnValue({
    post,
    comments: [],
    errorMessage: "",
    isLoading: false,
    isValidPostId: true,
    refresh: vi.fn(),
  });
  deleteBoardRequest.mockResolvedValue(undefined);
  getMyInfoRequest.mockResolvedValue({ data: {} });
});

describe("BoardDetailPage", () => {
  it("게시글 삭제 버튼을 누르면 확인 모달을 열고 확인 시 게시글을 삭제한다", async () => {
    const user = userEvent.setup();

    renderBoardDetailPage();

    await user.click(screen.getByRole("button", { name: "삭제" }));

    expect(
      screen.getByRole("dialog", { name: "질문을 삭제하시겠습니까?" }),
    ).toHaveTextContent("삭제한 내용은 복구할 수 없습니다.");
    expect(deleteBoardRequest).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "확인" }));

    await waitFor(() => {
      expect(deleteBoardRequest).toHaveBeenCalledWith(42);
      expect(screen.getByLabelText("현재 경로")).toHaveTextContent("/boards");
    });
  });

  it("게시글 삭제 모달에서 취소하면 삭제하지 않는다", async () => {
    const user = userEvent.setup();

    renderBoardDetailPage();

    await user.click(screen.getByRole("button", { name: "삭제" }));
    await user.click(screen.getByRole("button", { name: "취소" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(deleteBoardRequest).not.toHaveBeenCalled();
  });
});
