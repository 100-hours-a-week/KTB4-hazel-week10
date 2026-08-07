vi.mock("./http.js", () => ({
  request: vi.fn(),
}));

import { request } from "./http.js";
import {
  cancelVoteRequest,
  createBoardRequest,
  deleteBoardRequest,
  getBoardDetailRequest,
  getBoardsRequest,
  getSelectedBoardsRequest,
  updateBoardRequest,
  voteBoardRequest,
} from "./boardApi.js";

beforeEach(() => {
  vi.clearAllMocks();
  request.mockResolvedValue({ data: {} });
});

describe("boardApi", () => {
  it("getBoardsRequest는 기본 페이지 정보로 게시글 목록을 조회한다", async () => {
    await getBoardsRequest();

    expect(request).toHaveBeenCalledWith("/boards?page=0&size=10", {
      method: "GET",
    });
  });

  it("getBoardsRequest는 페이지와 카테고리를 query string으로 전달한다", async () => {
    await getBoardsRequest(2, 20, "FRONTEND");

    expect(request).toHaveBeenCalledWith(
      "/boards?page=2&size=20&category=FRONTEND",
      { method: "GET" },
    );
  });

  it("getSelectedBoardsRequest는 선택한 게시글 목록을 조회한다", async () => {
    await getSelectedBoardsRequest(1, 5, "BACKEND");

    expect(request).toHaveBeenCalledWith(
      "/boards/selected?page=1&size=5&category=BACKEND",
      { method: "GET" },
    );
  });

  it.each([
    [true, "/boards/42?countView=true"],
    [false, "/boards/42?countView=false"],
  ])("getBoardDetailRequest는 countView=%s로 상세 게시글을 조회한다", async (countView, path) => {
    await getBoardDetailRequest(42, countView);

    expect(request).toHaveBeenCalledWith(path, { method: "GET" });
  });

  it("updateBoardRequest는 게시글 수정 데이터를 PATCH 요청으로 전달한다", async () => {
    const formData = new FormData();

    await updateBoardRequest(42, formData);

    expect(request).toHaveBeenCalledWith("/boards/42", {
      method: "PATCH",
      body: formData,
    });
  });

  it("createBoardRequest는 게시글 데이터를 POST 요청으로 전달한다", async () => {
    const formData = new FormData();

    await createBoardRequest(formData);

    expect(request).toHaveBeenCalledWith("/boards", {
      method: "POST",
      body: formData,
    });
  });

  it("deleteBoardRequest는 게시글 삭제 DELETE 요청을 전달한다", async () => {
    await deleteBoardRequest(42);

    expect(request).toHaveBeenCalledWith("/boards/42", {
      method: "DELETE",
    });
  });

  it("voteBoardRequest는 voteType을 JSON으로 변환해 POST 요청으로 전달한다", async () => {
    await voteBoardRequest(42, "LIKE");

    expect(request).toHaveBeenCalledWith("/boards/42/votes", {
      method: "POST",
      body: JSON.stringify({ voteType: "LIKE" }),
    });
  });

  it("cancelVoteRequest는 게시글 투표 취소 DELETE 요청을 전달한다", async () => {
    await cancelVoteRequest(42);

    expect(request).toHaveBeenCalledWith("/boards/42/votes", {
      method: "DELETE",
    });
  });
});
