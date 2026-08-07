vi.mock("./http.js", () => ({
  request: vi.fn(),
}));

import { request } from "./http.js";
import {
  createCommentRequest,
  deleteCommentRequest,
  getCommentsRequest,
  updateCommentRequest,
} from "./commentApi.js";

beforeEach(() => {
  vi.clearAllMocks();
  request.mockResolvedValue({ data: {} });
});

describe("commentApi", () => {
  it("getCommentsRequest는 게시글의 댓글 목록을 조회한다", async () => {
    await getCommentsRequest(42);

    expect(request).toHaveBeenCalledWith("/boards/42/comments", {
      method: "GET",
    });
  });

  it("createCommentRequest는 댓글 내용을 JSON POST 요청으로 전달한다", async () => {
    const data = { content: "좋은 질문입니다." };

    await createCommentRequest(42, data);

    expect(request).toHaveBeenCalledWith("/boards/42/comments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("updateCommentRequest는 댓글 수정 내용을 JSON PATCH 요청으로 전달한다", async () => {
    const data = { content: "수정된 댓글입니다." };

    await updateCommentRequest(42, 7, data);

    expect(request).toHaveBeenCalledWith("/boards/42/comments/7", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  });

  it("deleteCommentRequest는 댓글 삭제 DELETE 요청을 전달한다", async () => {
    await deleteCommentRequest(42, 7);

    expect(request).toHaveBeenCalledWith("/boards/42/comments/7", {
      method: "DELETE",
    });
  });
});
