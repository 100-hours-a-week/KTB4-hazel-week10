vi.mock("./http.js", () => ({
  default: {
    delete: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
  },
}));

import apiClient from "./http.js";
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
  apiClient.delete.mockResolvedValue({ data: {} });
  apiClient.get.mockResolvedValue({ data: {} });
  apiClient.patch.mockResolvedValue({ data: {} });
  apiClient.post.mockResolvedValue({ data: {} });
});

describe("boardApi", () => {
  it("getBoardsRequest는 기본 페이지 정보로 게시글 목록을 조회한다", async () => {
    await getBoardsRequest();

    expect(apiClient.get).toHaveBeenCalledWith("/boards?page=0&size=10");
  });

  it("getBoardsRequest는 페이지와 카테고리를 query string으로 전달한다", async () => {
    await getBoardsRequest(2, 20, "FRONTEND");

    expect(apiClient.get).toHaveBeenCalledWith(
      "/boards?page=2&size=20&category=FRONTEND",
    );
  });

  it("getSelectedBoardsRequest는 선택한 게시글 목록을 조회한다", async () => {
    await getSelectedBoardsRequest(1, 5, "BACKEND");

    expect(apiClient.get).toHaveBeenCalledWith(
      "/boards/selected?page=1&size=5&category=BACKEND",
    );
  });

  it.each([
    [true, "/boards/42?countView=true"],
    [false, "/boards/42?countView=false"],
  ])("getBoardDetailRequest는 countView=%s로 상세 게시글을 조회한다", async (countView, path) => {
    await getBoardDetailRequest(42, countView);

    expect(apiClient.get).toHaveBeenCalledWith(path);
  });

  it("updateBoardRequest는 게시글 수정 데이터를 PATCH 요청으로 전달한다", async () => {
    const formData = new FormData();

    await updateBoardRequest(42, formData);

    expect(apiClient.patch).toHaveBeenCalledWith("/boards/42", formData);
  });

  it("createBoardRequest는 게시글 데이터를 POST 요청으로 전달한다", async () => {
    const formData = new FormData();

    await createBoardRequest(formData);

    expect(apiClient.post).toHaveBeenCalledWith("/boards", formData);
  });

  it("deleteBoardRequest는 게시글 삭제 DELETE 요청을 전달한다", async () => {
    await deleteBoardRequest(42);

    expect(apiClient.delete).toHaveBeenCalledWith("/boards/42");
  });

  it("voteBoardRequest는 voteType을 POST 요청으로 전달한다", async () => {
    await voteBoardRequest(42, "LIKE");

    expect(apiClient.post).toHaveBeenCalledWith("/boards/42/votes", {
      voteType: "LIKE",
    });
  });

  it("cancelVoteRequest는 게시글 투표 취소 DELETE 요청을 전달한다", async () => {
    await cancelVoteRequest(42);

    expect(apiClient.delete).toHaveBeenCalledWith("/boards/42/votes");
  });
});
