import { useState } from "react";

import { formatDate } from "@/utils/formatDate.js";
import { resolveImageUrl } from "@/utils/resolveImageUrl.js";

function handleImageError(event) {
  event.currentTarget.removeAttribute(
    "src",
  );
}

function CommentItem({ comment, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editError, setEditError] = useState("");
  const profileImageUrl = resolveImageUrl(comment.writerProfileImage);

  const handleStartEdit = () => {
    setEditContent(comment.content);
    setEditError("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (isSubmitting) {
      return;
    }

    setEditContent(comment.content);
    setEditError("");
    setIsEditing(false);
  };

  const handleSubmitEdit = async () => {
    const trimmedContent = editContent.trim();

    if (!trimmedContent) {
      setEditError("댓글 내용을 입력해주세요.");
      return;
    }

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setEditError("");

      const isUpdated = await onEdit(
        comment,
        trimmedContent,
      );

      if (isUpdated === false) {
        return;
      }

      setEditContent(trimmedContent);
      setIsEditing(false);
    } catch (error) {
      setEditError(
        error.message ||
          "댓글 수정에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-item" data-comment-id={comment.id}>
      <img
        className="profile__image"
        src={profileImageUrl || undefined}
        alt=""
        loading="lazy"
        decoding="async"
        onError={handleImageError}
      />

      <div className="comment-item__content">
        <div className="comment-item__meta">
          <span className="comment-item__author">{comment.writer}</span>
          <span className="comment-item__date">{formatDate(comment.createdAt)}</span>

          {comment.isOwner && !isEditing && (
            <div className="comment-item__button-container">
              <button
                className="detail__button"
                type="button"
                onClick={handleStartEdit}
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

        {isEditing ? (
          <div className="comment-item__edit-form">
            <textarea
              className="comment-item__edit-textarea"
              aria-label="댓글 수정"
              rows={3}
              value={editContent}
              disabled={isSubmitting}
              onChange={(event) => {
                setEditContent(event.target.value);
                setEditError("");
              }}
            />

            {editError && (
              <p className="comment-item__edit-error" role="alert">
                {editError}
              </p>
            )}

            <div className="comment-item__edit-actions">
              <button
                className="detail__button"
                type="button"
                disabled={isSubmitting}
                onClick={handleCancelEdit}
              >
                취소
              </button>
              <button
                className="comment-item__edit-submit"
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitEdit}
              >
                {isSubmitting ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-item__text">{comment.content}</p>
        )}
      </div>
    </div>
  );
}

export default CommentItem;
