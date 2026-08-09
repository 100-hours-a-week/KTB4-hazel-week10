import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import PostContent from "@/pages/boardDetailPage/components/PostContent.jsx";
import CommentItem from "@/pages/boardDetailPage/components/CommentItem.jsx";
import BoardDetailSkeleton from "@/pages/boardDetailPage/components/BoardDetailSkeleton.jsx";
import "@/index.css";
import "@/pages/boardDetailPage/index.css";

const post = {
  id: 1,
  title: "브라우저의 렌더링 과정을 설명해주세요.",
  category: "FRONTEND",
  text: "HTML 파싱부터 DOM/CSSOM 생성, 렌더 트리 구축, 레이아웃, 페인트, 합성까지 순서대로 설명해주세요.",
  images: [],
  likeCount: 8,
  views: 132,
  comments: 4,
  agreeCount: 12,
  disagreeCount: 3,
  myVoteType: "AGREE",
  createdAt: "2026-08-09T07:00:00",
  writer: "hazel",
  writerProfileImage: "",
  isOwner: false,
};

const comment = {
  id: 1,
  content: "합성 단계까지 같이 물어보면 좋을 것 같아요.",
  writer: "jun",
  writerProfileImage: "",
  createdAt: "2026-08-09T09:12:00",
  isOwner: false,
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <main className="detail">
      <section className="detail-container">
        <PostContent post={post} onEdit={() => {}} onDelete={() => {}} onVote={() => {}} />

        <div className="comment-list">
          <CommentItem comment={comment} onEdit={() => {}} onDelete={() => {}} />
        </div>

        <BoardDetailSkeleton commentCount={1} />
      </section>
    </main>
  </StrictMode>,
);
