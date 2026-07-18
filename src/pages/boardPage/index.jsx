import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/header/index.jsx";
import { getBoardsRequest } from "../../api/boardApi.js";
import { formatDate } from "../../utils/formatDate.js";
import { resolveImageUrl } from "../../utils/resolveImageUrl.js";

import "./index.css";

const WRITE_PATH = "/boards/write";

function getBoardDetailPath(postId) {
  return `/boards/${postId}`;
}

// 백엔드에 마감 시간이 생기기 전까지 사용하는 임시 함수
function getMockDeadline(id, baseTime) {
  const hoursLeft = ((id * 13) % 60) - 12;

  return baseTime + hoursLeft * 60 * 60 * 1000;
}

function addDeadlines(posts, baseTime) {
  return posts.map((post) => ({
    ...post,
    deadline: getMockDeadline(post.id, baseTime),
  }));
}

function getDeadlineState(diffMs) {
  if (diffMs <= 0) {
    return "over";
  }

  const hours = diffMs / (1000 * 60 * 60);

  if (hours < 3) {
    return "urgent";
  }

  if (hours < 24) {
    return "soon";
  }

  return "normal";
}

function formatCountdown(diffMs) {
  if (diffMs <= 0) {
    return "마감";
  }

  const pad = (number) => {
    return String(number).padStart(2, "0");
  };

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);

  const hours = Math.floor(
    (totalSeconds % 86400) / 3600,
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );

  const seconds = totalSeconds % 60;

  const clock = [
    pad(hours),
    pad(minutes),
    pad(seconds),
  ].join(":");

  return days > 0 ? `${days}일 ${clock}` : clock;
}

function PostItem({
  post,
  currentTime,
  onClick,
}) {
  const {
    title,
    likeCount,
    commentCount,
    viewCount,
    createdAt,
    writer,
    writerProfileImage,
    deadline,
  } = post;

  const profileImageUrl = resolveImageUrl(
    writerProfileImage,
  );

  const diffMs =
    currentTime === null
      ? null
      : deadline - currentTime;

  const deadlineState =
    diffMs === null
      ? "normal"
      : getDeadlineState(diffMs);

  const countdown =
    diffMs === null
      ? "--:--:--"
      : formatCountdown(diffMs);

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      onClick();
    }
  };

  const handleImageError = (event) => {
    event.currentTarget.removeAttribute("src");
  };

  return (
    <article
      className="item"
      role="link"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className="item__top">
        <span className="item__title">
          {title}
        </span>

        <span
          className={
            `item__deadline ` +
            `item__deadline--${deadlineState}`
          }
        >
          {countdown}
        </span>
      </div>

      <div className="count-container">
        <div className="count-container__list">
          <div className="count__item">
            <span className="count__text">
              좋아요
            </span>

            <span className="count__text">
              {likeCount}
            </span>
          </div>

          <div className="count__item">
            <span className="count__text">
              댓글
            </span>

            <span className="count__text">
              {commentCount}
            </span>
          </div>

          <div className="count__item">
            <span className="count__text">
              조회수
            </span>

            <span className="count__text">
              {viewCount}
            </span>
          </div>
        </div>

        <div className="count__text">
          {formatDate(createdAt)}
        </div>
      </div>

      <div className="line" />

      <div className="profile-container">
        <img
          className="profile__image"
          src={profileImageUrl || undefined}
          alt=""
          onError={handleImageError}
        />

        <div className="profile__name">
          {writer}
        </div>
      </div>
    </article>
  );
}

function BoardPage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [currentTime, setCurrentTime] =
    useState(null);
  const [isLoading, setIsLoading] =
    useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    document.title = "게시판";
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      try {
        const response =
          await getBoardsRequest();

        if (!isMounted) {
          return;
        }

        const receivedPosts =
          response.data ?? [];

        // Effect 내부이므로 Date.now()를 호출해도 됩니다.
        const loadedAt = Date.now();

        setCurrentTime(loadedAt);
        setPosts(
          addDeadlines(
            receivedPosts,
            loadedAt,
          ),
        );
        setErrorMessage("");
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setErrorMessage(
            "게시글을 불러오지 못했습니다.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(Date.now());
    };

    updateCurrentTime();

    const intervalId = window.setInterval(
      updateCurrentTime,
      1000,
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const handlePostClick = (postId) => {
    navigate(getBoardDetailPath(postId));
  };

  const handleWriteClick = () => {
    navigate(WRITE_PATH);
  };

  return (
    <>
      <Header type="withProfile" />

      <main className="board">
        <div className="title-container">
          <span className="title">
            게시판 페이지
          </span>
        </div>

        <div className="button-container">
          <button
            id="postWriteButton"
            className="button"
            type="button"
            onClick={handleWriteClick}
          >
            게시글 작성
          </button>
        </div>

        <div
          id="postList"
          className="list-container"
        >
          {isLoading && (
            <p className="board__loading">
              게시글을 불러오는 중입니다.
            </p>
          )}

          {!isLoading && errorMessage && (
            <p className="board__error">
              {errorMessage}
            </p>
          )}

          {!isLoading &&
            !errorMessage &&
            posts.length === 0 && (
              <p className="board__empty">
                등록된 게시글이 없습니다.
              </p>
            )}

          {!isLoading &&
            !errorMessage &&
            posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                currentTime={currentTime}
                onClick={() => {
                  handlePostClick(post.id);
                }}
              />
            ))}
        </div>
      </main>
    </>
  );
}

export default BoardPage;