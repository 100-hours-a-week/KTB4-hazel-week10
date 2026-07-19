import { formatDate } from "../../../utils/formatDate.js";
import { resolveImageUrl } from "../../../utils/resolveImageUrl.js";

function handleImageError(event) {
  event.currentTarget.removeAttribute(
    "src",
  );
}

export default function CommentItem({
  comment,
  onEdit,
  onDelete,
}) {
  const profileImageUrl =
    resolveImageUrl(
      comment.writerProfileImage,
    );

  return (
    <div
      className="comment-item"
      data-comment-id={comment.id}
    >
      <img
        className="profile__image"
        src={
          profileImageUrl || undefined
        }
        alt=""
        onError={handleImageError}
      />

      <div className="comment-item__content">
        <div className="comment-item__meta">
          <span className="comment-item__author">
            {comment.writer}
          </span>

          <span className="comment-item__date">
            {formatDate(
              comment.createdAt,
            )}
          </span>

          {comment.isOwner && (
            <div className="comment-item__button-container">
              <button
                className="detail__button"
                type="button"
                onClick={() =>
                  onEdit(comment)
                }
              >
                수정
              </button>

              <button
                className="detail__button"
                type="button"
                onClick={() =>
                  onDelete(comment.id)
                }
              >
                삭제
              </button>
            </div>
          )}
        </div>

        <p className="comment-item__text">
          {comment.content}
        </p>
      </div>
    </div>
  );
}