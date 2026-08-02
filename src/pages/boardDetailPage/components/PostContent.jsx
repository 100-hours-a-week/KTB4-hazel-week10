import { formatDate } from "@/utils/formatDate.js";
import { resolveImageUrl } from "@/utils/resolveImageUrl.js";
import { getCategoryLabel } from "@/utils/categories.js";

function handleImageError(event) {
  event.currentTarget.removeAttribute(
    "src",
  );
}

function PostImages({ images = [] }) {
  if (!images.length) {
    return null;
  }

  return (
    <div className="detail__image-list">
      {images.map(
        (imageUrl, index) => (
          <img
            key={`${imageUrl}-${index}`}
            className="detail__image"
            src={resolveImageUrl(imageUrl) || undefined}
            alt={`게시글 이미지 ${index + 1}`}
            onError={handleImageError}
          />
        ),
      )}
    </div>
  );
}

export default function PostContent({ post, onEdit, onDelete, onVote }) {
  const profileImageUrl = resolveImageUrl(post.writerProfileImage);

  return (
    <div className="detail__card">
      {post.category && (
        <span className="detail__category">{getCategoryLabel(post.category)}</span>
      )}

      <h2 className="detail__title">{post.title}</h2>

      <div className="detail__meta">
        <div className="detail__mate-container">
          <div className="profile-container">
            <img
              className="profile__image"
              src={profileImageUrl || undefined}
              alt=""
              onError={handleImageError}
            />

            <div className="profile__name">{post.writer}</div>
          </div>

          <span className="detail__date">{formatDate(post.createdAt)}</span>
        </div>

        {post.isOwner && (
          <div className="detail__button-container">
            <button
              className="detail__button"
              type="button"
              onClick={onEdit}
            >
              수정
            </button>

            <button
              className="detail__button"
              type="button"
              onClick={onDelete}
            >
              삭제
            </button>
          </div>
        )}
      </div>

      <div className="line" />

      <PostImages images={post.images}/>
      <p className="detail__content">{post.text}</p>
      <div className="detail__count-container">
        <div className="detail__count-box">
          <strong>{post.likeCount}</strong>
          <span>좋아요수</span>
        </div>

        <div className="detail__count-box">
          <strong>{post.views}</strong>
          <span>조회수</span>
        </div>

        <div className="detail__count-box">
          <strong>{post.comments}</strong>
          <span>댓글</span>
        </div>
      </div>

      <div className="detail__vote-container">
        <button
          type="button"
          className={`detail__vote-button detail__vote-button--agree ${post.myVoteType === "AGREE" ? "is-active" : ""}`}
          onClick={() => onVote("AGREE")}
        >
          찬성 {post.agreeCount}
        </button>

        <button
          type="button"
          className={`detail__vote-button detail__vote-button--disagree ${post.myVoteType === "DISAGREE" ? "is-active" : ""}`}
          onClick={() => onVote("DISAGREE")}
        >
          반대 {post.disagreeCount}
        </button>
      </div>
    </div>
  );
}