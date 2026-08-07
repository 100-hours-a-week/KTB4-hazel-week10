/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostContent from "./PostContent.jsx";

const post = {
  category: "BACKEND",
  title: "API 응답을 확인하고 싶어요",
  writer: "hazel",
  createdAt: "2026-08-07T12:30:45.123Z",
  writerProfileImage: "",
  images: ["/images/first.png", "https://example.com/second.png"],
  isOwner: true,
  text: "응답 형식에 대한 질문입니다.",
  likeCount: 4,
  views: 22,
  comments: 3,
  agreeCount: 7,
  disagreeCount: 2,
  myVoteType: "AGREE",
};

describe("PostContent", () => {
  it("게시글 내용과 이미지, 통계 정보를 표시한다", () => {
    render(
      <PostContent
        post={post}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onVote={vi.fn()}
      />,
    );

    expect(screen.getByText("BE")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: post.title })).toBeInTheDocument();
    expect(screen.getByText(post.writer)).toBeInTheDocument();
    expect(screen.getByText("응답 형식에 대한 질문입니다.")).toBeInTheDocument();
    expect(screen.getByText("2026-08-07 12:30:45")).toBeInTheDocument();
    expect(screen.getByAltText("게시글 이미지 1")).toHaveAttribute("loading", "eager");
    expect(screen.getByAltText("게시글 이미지 2")).toHaveAttribute("loading", "lazy");
    expect(screen.getByText("좋아요수")).toBeInTheDocument();
    expect(screen.getByText("조회수")).toBeInTheDocument();
    expect(screen.getByText("댓글")).toBeInTheDocument();
  });

  it("작성자 본인의 게시글이면 수정과 삭제 동작을 제공한다", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <PostContent
        post={post}
        onEdit={onEdit}
        onDelete={onDelete}
        onVote={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "수정" }));
    await user.click(screen.getByRole("button", { name: "삭제" }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("찬성 또는 반대 버튼을 누르면 선택한 투표 유형을 전달한다", async () => {
    const user = userEvent.setup();
    const onVote = vi.fn();

    render(
      <PostContent
        post={post}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onVote={onVote}
      />,
    );

    await user.click(screen.getByRole("button", { name: "찬성 7" }));
    await user.click(screen.getByRole("button", { name: "반대 2" }));

    expect(onVote).toHaveBeenNthCalledWith(1, "AGREE");
    expect(onVote).toHaveBeenNthCalledWith(2, "DISAGREE");
  });
});
