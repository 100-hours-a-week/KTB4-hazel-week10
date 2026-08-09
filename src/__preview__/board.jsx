import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import PostItem from "@/pages/boardPage/components/PostItem.jsx";
import BoardListSkeleton from "@/pages/boardPage/components/BoardListSkeleton.jsx";
import "@/index.css";
import "@/pages/boardPage/index.css";

const post = {
  id: 1,
  title: "브라우저의 렌더링 과정을 리플로우와 리페인트를 포함해 설명해주세요.",
  category: "FRONTEND",
  likeCount: 8,
  agreeCount: 12,
  disagreeCount: 3,
  commentCount: 4,
  viewCount: 132,
  createdAt: "2026-08-09T07:00:00",
  writer: "hazel",
  writerProfileImage: "",
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <main className="board">
      <div className="list-container">
        <PostItem post={post} onClick={() => {}} />
        <BoardListSkeleton count={1} />
      </div>
    </main>
  </StrictMode>,
);
