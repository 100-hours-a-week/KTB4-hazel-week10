

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

    await user.click(screen.getByRole("button", { name: "삭제" }));

    expect(onDelete).toHaveBeenCalledWith(42);
    expect(screen.getByRole("button", { name: "수정" })).toBeInTheDocument();
    expect(onEdit).not.toHaveBeenCalled();
  });

  it("수정 버튼을 누르면 댓글을 편집하고 저장할 수 있다", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn().mockResolvedValue(true);
    const ownerComment = { ...comment, isOwner: true };

    const { rerender } = render(
      <CommentItem
        comment={ownerComment}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "수정" }));

    const textarea = screen.getByRole("textbox", { name: "댓글 수정" });

    expect(textarea).toHaveValue(comment.content);

    await user.clear(textarea);
    await user.type(textarea, "수정된 댓글입니다.");
    await user.click(screen.getByRole("button", { name: "저장" }));

    expect(onEdit).toHaveBeenCalledWith(
      ownerComment,
      "수정된 댓글입니다.",
    );

    rerender(
      <CommentItem
        comment={{ ...ownerComment, content: "수정된 댓글입니다." }}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("수정된 댓글입니다.")).toBeInTheDocument();
  });

  it("댓글 수정 중 취소하면 기존 댓글을 유지한다", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(
      <CommentItem
        comment={{ ...comment, isOwner: true }}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "수정" }));
    const textarea = screen.getByRole("textbox", { name: "댓글 수정" });
    await user.clear(textarea);
    await user.type(textarea, "저장하지 않을 내용");
    await user.click(screen.getByRole("button", { name: "취소" }));

    expect(screen.queryByRole("textbox", { name: "댓글 수정" })).not.toBeInTheDocument();
    expect(screen.getByText(comment.content)).toBeInTheDocument();
    expect(onEdit).not.toHaveBeenCalled();
  });

  it("빈 내용으로 저장하면 수정 요청을 보내지 않고 오류를 표시한다", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(
      <CommentItem
        comment={{ ...comment, isOwner: true }}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "수정" }));
    const textarea = screen.getByRole("textbox", { name: "댓글 수정" });
    await user.clear(textarea);
    await user.click(screen.getByRole("button", { name: "저장" }));

    expect(screen.getByRole("alert")).toHaveTextContent("댓글 내용을 입력해주세요.");
    expect(onEdit).not.toHaveBeenCalled();
    expect(textarea).toBeInTheDocument();
  });

  it("저장 요청에 실패하면 편집 상태와 입력 내용을 유지한다", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn().mockRejectedValue(new Error("저장할 수 없습니다."));

    render(
      <CommentItem
        comment={{ ...comment, isOwner: true }}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "수정" }));
    await user.click(screen.getByRole("button", { name: "저장" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("저장할 수 없습니다.");
    expect(screen.getByRole("textbox", { name: "댓글 수정" })).toHaveValue(comment.content);
    expect(onEdit).toHaveBeenCalledWith(
      { ...comment, isOwner: true },
      comment.content,
    );
  });
});
