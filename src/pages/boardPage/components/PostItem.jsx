import { formatDate } from "@/utils/formatDate.js";
import { resolveImageUrl } from "@/utils/resolveImageUrl.js";
import { getCategoryLabel } from "@/utils/categories.js";

function handleImageError(event) {
  event.currentTarget.removeAttribute("src");
}

function PostItem({ post, onClick }) {
  const { title, category, likeCount, agreeCount, disagreeCount, commentCount, viewCount, createdAt, writer, writerProfileImage } = post;

  const profileImageUrl = resolveImageUrl(writerProfileImage);

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
        <div className="item__title-row">
          {category && (
            <span className="item__category">{getCategoryLabel(category)}</span>
          )}
          <span className="item__qmark">Q</span>
          <span className="item__title">{title}</span>
        </div>

        <div className="item__vote">
          <span className="item__vote-badge item__vote-badge--agree">찬성 {agreeCount}</span>
          <span className="item__vote-badge item__vote-badge--disagree">반대 {disagreeCount}</span>
        </div>
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

      <div className="line__item" />

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