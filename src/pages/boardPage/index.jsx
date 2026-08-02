import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header/index.jsx";
import { getBoardsRequest } from "@/api/boardApi.js";
import PostItem from "./components/PostItem.jsx";
import CategoryFilter from "@/components/categoryFilter/index.jsx";
import "./index.css";

const WRITE_PATH = "/boards/write";
const SELECTED_PATH = "/boards/selected";

function getBoardDetailPath(postId) {
  return `/boards/${postId}`;
}

function BoardPage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.title = "면접 질문 게시판";
  }, []);

  useEffect(() => {
    let isCancelled = false;

    setIsLoading(true);

    getBoardsRequest(category)
      .then((response) => {
        if (isCancelled) {
          return;
        }

        setPosts(response.data ?? []);
        setErrorMessage("");
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }

        console.error("질문 목록 조회 실패:", error);
        setErrorMessage("질문을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [category]);

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

        <CategoryFilter value={category} onChange={setCategory} />

        <div className="list-container">
          {isLoading && (
            <p className="board__loading">질문을 불러오는 중입니다.</p>
          )}

          {!isLoading && errorMessage && (
            <p className="board__error">{errorMessage}</p>
          )}

          {!isLoading && !errorMessage && posts.length === 0 && (
            <p className="board__empty">등록된 질문이 없습니다.</p>
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
      </main>
    </>
  );
}

export default BoardPage;