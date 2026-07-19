import { formatDate } from "@/utils/formatDate.js";
import { resolveImageUrl } from "@/utils/resolveImageUrl.js";
import { formatCountdown, getDeadlineState } from "../boardDeadlineUtils.js";

function handleImageError(event) {
  event.currentTarget.removeAttribute("src");
}

function PostItem({ post, currentTime, onClick }) {
  const { title, likeCount, commentCount, viewCount, createdAt, writer, writerProfileImage, deadline } = post;

  const profileImageUrl = resolveImageUrl(writerProfileImage);
  const diffMs = currentTime === null ? null : deadline - currentTime;
  const deadlineState = diffMs === null ? "normal" : getDeadlineState(diffMs);
  const countdown = diffMs === null ? "--:--:--" : formatCountdown(diffMs);

  const handleKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    onClick();
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
        <span className="item__title">{title}</span>
        <span className={`item__deadline item__deadline--${deadlineState}`}>{countdown}</span>
      </div>

      <div className="count-container">
        <div className="count-container__list">
          <div className="count__item">
            <span className="count__text">좋아요</span>
            <span className="count__text">{likeCount}</span>
          </div>

          <div className="count__item">
            <span className="count__text">댓글</span>
            <span className="count__text">{commentCount}</span>
          </div>

          <div className="count__item">
            <span className="count__text">조회수</span>
            <span className="count__text">{viewCount}</span>
          </div>
        </div>

        <div className="count__text">{formatDate(createdAt)}</div>
      </div>

      <div className="line" />

      <div className="profile-container">
        <img
          className="profile__image"
          src={profileImageUrl || undefined}
          alt=""
          onError={handleImageError}
        />
        <div className="profile__name">{writer}</div>
      </div>
    </article>
  );
}

export default PostItem;