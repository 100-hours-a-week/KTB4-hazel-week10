/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommentItem from "./CommentItem.jsx";

const comment = {
  id: 42,
  writer: "hazel",
  content: "좋은 질문입니다.",
  createdAt: "2026-08-07T12:30:45.123Z",
  writerProfileImage: "",
  isOwner: false,
};

describe("CommentItem", () => {
  it("댓글 작성자, 작성일, 내용을 표시한다", () => {
    render(
      <CommentItem
        comment={comment}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("hazel")).toBeInTheDocument();
    expect(screen.getByText("2026-08-07 12:30:45")).toBeInTheDocument();
    expect(screen.getByText("좋은 질문입니다.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "수정" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "삭제" })).not.toBeInTheDocument();
  });

  it("작성자 본인의 댓글이면 수정과 삭제 버튼을 제공한다", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <CommentItem
        comment={{ ...comment, isOwner: true }}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    await user.click(screen.getByRole("button", { name: "수정" }));
    await user.click(screen.getByRole("button", { name: "삭제" }));

    expect(onEdit).toHaveBeenCalledWith({ ...comment, isOwner: true });
    expect(onDelete).toHaveBeenCalledWith(42);
  });
});
