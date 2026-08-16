vi.mock("./http.js", () => ({
  default: {
    delete: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
  },
}));

import apiClient from "./http.js";
import { createCommentRequest, deleteCommentRequest, getCommentsRequest, updateCommentRequest } from "./commentApi.js";

beforeEach(() => {
  vi.clearAllMocks();
  apiClient.delete.mockResolvedValue({ data: {} });
  apiClient.get.mockResolvedValue({ data: {} });
  apiClient.patch.mockResolvedValue({ data: {} });
  apiClient.post.mockResolvedValue({ data: {} });
});

describe("commentApi", () => {
  it("getCommentsRequest는 게시글의 댓글 목록을 조회한다", async () => {
    await getCommentsRequest(42);

    expect(apiClient.get).toHaveBeenCalledWith("/boards/42/comments");
  });

  it("createCommentRequest는 댓글 내용을 POST 요청으로 전달한다", async () => {
    const data = { content: "좋은 질문입니다." };

    await createCommentRequest(42, data);

    expect(apiClient.post).toHaveBeenCalledWith("/boards/42/comments", data);
  });

  it("updateCommentRequest는 댓글 수정 내용을 PATCH 요청으로 전달한다", async () => {
    const data = { content: "수정된 댓글입니다." };

    await updateCommentRequest(42, 7, data);

    expect(apiClient.patch).toHaveBeenCalledWith(
      "/boards/42/comments/7",
      data,
    );
  });

  it("deleteCommentRequest는 댓글 삭제 DELETE 요청을 전달한다", async () => {
    await deleteCommentRequest(42, 7);

    expect(apiClient.delete).toHaveBeenCalledWith("/boards/42/comments/7");
  });
});
