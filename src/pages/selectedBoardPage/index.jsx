import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header/index.jsx";
import boardQueries from "@/queryFactory/boardQueries.js";
import PostItem from "../boardPage/components/PostItem.jsx";
import BoardListSkeleton from "../boardPage/components/BoardListSkeleton.jsx";
import CategoryFilter from "@/components/categoryFilter/index.jsx";
import "../boardPage/index.css";
import "./index.css";

function getBoardDetailPath(postId) {
  return `/boards/${postId}`;
}

function SelectedBoardPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [category, setCategory] = useState("");
  const selectedBoardQuery = useQuery(
    boardQueries.selectedList(page, 10, category),
  );

  const posts = selectedBoardQuery.data?.data?.content ?? [];
  const totalPages = selectedBoardQuery.data?.data?.totalPages ?? 0;
  const isLoading = selectedBoardQuery.isPending;
  const errorMessage = selectedBoardQuery.error
    ? "선정된 질문을 불러오지 못했습니다."
    : "";

  useEffect(() => {
    document.title = "선정된 면접 질문";
  }, []);

  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);
    setPage(0);
  };

  return (
    <>
      <Header type="withBackAndProfile" />

      <main className="board">
        <div className="title-container">
          <span className="title">선정된 면접 질문</span>
          <span className="subtitle">찬성이 반대보다 많은 질문들이에요. 매일 아침 7시에 이 중 3개가 랜덤으로 뽑혀 디스코드로 전달됩니다.</span>
        </div>

        <CategoryFilter value={category} onChange={handleCategoryChange} />

        <div className="list-container">
          {isLoading && (
            <BoardListSkeleton count={3} label="선정된 질문을 불러오는 중입니다." />
          )}

          {!isLoading && errorMessage && (
            <p className="board__error">{errorMessage}</p>
          )}

          {!isLoading && !errorMessage && posts.length === 0 && (
            <p className="board__empty">아직 선정된 질문이 없습니다.</p>
          )}

          {!isLoading &&
            !errorMessage &&
            posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
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
    </>
  );
}

export default SelectedBoardPage;
