import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header/index.jsx";
import Modal from "@/components/modal/index.jsx";
import boardQueries from "@/queryFactory/boardQueries.js";
import userQueries from "@/queryFactory/userQueries.js";
import PostItem from "./components/PostItem.jsx";
import BoardListSkeleton from "./components/BoardListSkeleton.jsx";
import CategoryFilter from "@/components/categoryFilter/index.jsx";
import "./index.css";

const WRITE_PATH = "/boards/write";
const SELECTED_PATH = "/boards/selected";
const NOTIFICATION_SETTINGS_PATH = "/users/notifications";

function getBoardDetailPath(postId) {
  return `/boards/${postId}`;
}

function getDiscordPromptKey() {
  const userId = localStorage.getItem("userId");

  return userId ? `discordPromptSeen:${userId}` : null;
}

function BoardPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [category, setCategory] = useState("");
  const [isDiscordPromptOpen, setIsDiscordPromptOpen] = useState(false);

  const promptKey = getDiscordPromptKey();
  const boardQuery = useQuery(boardQueries.list(page, 10, category));
  const notificationQuery = useQuery({
    ...userQueries.notificationSettings(),
    enabled: Boolean(promptKey) && !localStorage.getItem(promptKey),
  });

  const posts = boardQuery.data?.data?.content ?? [];
  const totalPages = boardQuery.data?.data?.totalPages ?? 0;
  const isLoading = boardQuery.isPending;
  const errorMessage = boardQuery.error
    ? "질문을 불러오지 못했습니다."
    : "";

  useEffect(() => {
    document.title = "면접 질문 게시판";
  }, []);

  useEffect(() => {
    const notificationData = notificationQuery.data?.data;

    if (
      !promptKey ||
      !notificationData ||
      notificationData.discordUserId ||
      localStorage.getItem(promptKey)
    ) {
      return;
    }

    localStorage.setItem(promptKey, "true");
    setIsDiscordPromptOpen(true);
  }, [notificationQuery.data, promptKey]);
  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);
    setPage(0);
  };

  return (
    <>
      <Header type="withProfile" />

      <main className="board">
        <div className="title-container">
          <span className="title">면접 질문 게시판</span>
          <span className="subtitle">찬성이 반대보다 많은 질문은 매일 아침 7시, 무작위로 3개씩 선정돼요</span>
        </div>

        <div className="button-container">
          <button
            className="button"
            type="button"
            onClick={() => navigate(WRITE_PATH)}
          >
            질문 등록
          </button>

          <button
            className="button button--outline"
            type="button"
            onClick={() => navigate(SELECTED_PATH)}
          >
            선정된 질문
          </button>
        </div>

        <CategoryFilter value={category} onChange={handleCategoryChange} />

        <div className="list-container">
          {isLoading && (
            <BoardListSkeleton label="질문 목록을 불러오는 중입니다." />
          )}

          {!isLoading && errorMessage && (
            <p className="board__error">{errorMessage}</p>
          )}

          {!isLoading && !errorMessage && posts.length === 0 && (
            <p className="board__empty">등록된 질문이 없습니다.</p>
          )}

          {!isLoading &&
            !errorMessage &&
            posts.map((post, index) => (
              <PostItem
                key={post.id}
                post={post}
                index={index}
                onClick={() => navigate(getBoardDetailPath(post.id))}
              />
            ))}
        </div>

        {!isLoading && !errorMessage && totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination__button"
              type="button"
              disabled={page === 0}
              onClick={() => setPage((prev) => prev - 1)}
            >
              이전
            </button>

            <span className="pagination__text">{page + 1} / {totalPages}</span>

            <button
              className="pagination__button"
              type="button"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              다음
            </button>
          </div>
        )}
      </main>

      <Modal
        id="discord-prompt-modal"
        isOpen={isDiscordPromptOpen}
        title="디스코드로 면접 질문 받아보기"
        description="매일 아침 7시, 선정된 면접 질문을 디스코드로 보내드려요. 지금 알림을 설정해보세요."
        cancelText="나중에"
        confirmText="설정하러 가기"
        onCancel={() => setIsDiscordPromptOpen(false)}
        onConfirm={() => navigate(NOTIFICATION_SETTINGS_PATH)}
      />
    </>
  );
}

export default BoardPage;
