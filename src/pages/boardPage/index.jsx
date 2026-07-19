import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header/index.jsx";
import { getBoardsRequest } from "@/api/boardApi.js";
import PostItem from "./components/PostItem.jsx";
import { addDeadlines } from "./boardDeadlineUtils.js";
import "./index.css";

const WRITE_PATH = "/boards/write";

function getBoardDetailPath(postId) {
  return `/boards/${postId}`;
}

function BoardPage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [currentTime, setCurrentTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.title = "게시판";
  }, []);

  useEffect(() => {
    let isCancelled = false;

    getBoardsRequest()
      .then((response) => {
        if (isCancelled) {
          return;
        }

        const loadedAt = Date.now();
        const receivedPosts = response.data ?? [];

        setCurrentTime(loadedAt);
        setPosts(addDeadlines(receivedPosts, loadedAt));
        setErrorMessage("");
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }

        console.error("게시글 목록 조회 실패:", error);
        setErrorMessage("게시글을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <Header type="withProfile" />

      <main className="board">
        <div className="title-container">
          <span className="title">게시판 페이지</span>
        </div>

        <div className="button-container">
          <button
            className="button"
            type="button"
            onClick={() => navigate(WRITE_PATH)}
          >
            게시글 작성
          </button>
        </div>

        <div className="list-container">
          {isLoading && (
            <p className="board__loading">게시글을 불러오는 중입니다.</p>
          )}

          {!isLoading && errorMessage && (
            <p className="board__error">{errorMessage}</p>
          )}

          {!isLoading && !errorMessage && posts.length === 0 && (
            <p className="board__empty">등록된 게시글이 없습니다.</p>
          )}

          {!isLoading &&
            !errorMessage &&
            posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                currentTime={currentTime}
                onClick={() => navigate(getBoardDetailPath(post.id))}
              />
            ))}
        </div>
      </main>
    </>
  );
}

export default BoardPage;