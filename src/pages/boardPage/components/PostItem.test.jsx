/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostItem from "./PostItem.jsx";

const post = {
  title: "React 질문입니다",
  category: "FRONTEND",
  likeCount: 3,
  agreeCount: 5,
  disagreeCount: 1,
  commentCount: 2,
  viewCount: 10,
  createdAt: "2026-08-07T12:30:45.123Z",
  writer: "hazel",
  writerProfileImage: "/profiles/hazel.png",
};

describe("PostItem", () => {
  it("게시글의 카테고리, 제목, 작성자, 통계 정보를 표시한다", () => {
    render(<PostItem post={post} onClick={vi.fn()} />);

    const item = screen.getByRole("link");

    expect(item).toHaveTextContent("FE");
    expect(item).toHaveTextContent("React 질문입니다");
    expect(item).toHaveTextContent("찬성 5");
    expect(item).toHaveTextContent("반대 1");
    expect(item).toHaveTextContent("좋아요");
    expect(item).toHaveTextContent("댓글");
    expect(item).toHaveTextContent("조회수");
    expect(item).toHaveTextContent("2026-08-07 12:30:45");
    expect(item).toHaveTextContent("hazel");
  });

  it("클릭하거나 Enter와 Space를 누르면 onClick을 호출한다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<PostItem post={post} onClick={onClick} />);

    const item = screen.getByRole("link");

    await user.click(item);
    item.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("Enter와 Space가 아닌 키를 누르면 onClick을 호출하지 않는다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<PostItem post={post} onClick={onClick} />);

    const item = screen.getByRole("link");
    item.focus();

    await user.keyboard("{ArrowDown}");

    expect(onClick).not.toHaveBeenCalled();
  });
});
