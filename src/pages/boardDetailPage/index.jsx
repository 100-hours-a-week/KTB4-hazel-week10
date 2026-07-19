import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import Header from "../../components/header/index.jsx";
import Modal from "../../components/modal/index.jsx";
import useBooleanState from "../../utils/useBooleanState.js";

import { deleteBoardRequest } from "../../api/boardApi.js";
import { createCommentRequest, deleteCommentRequest, updateCommentRequest } from "../../api/commentApi.js";

import PostContent from "./components/PostContent.jsx";
import CommentItem from "./components/CommentItem.jsx";
import useBoardDetail from "./hooks/useBoardDetail.js";

import "./index.css";

const BOARD_LIST_PATH = "/boards";

function getEditPath(postId) {
  return `/boards/${postId}/edit`;
}

function BoardDetailPage() {
  const navigate = useNavigate();
  const { postId: pathPostId } = useParams();
  const [searchParams] = useSearchParams();

  const postId = Number(
    pathPostId ??
      searchParams.get("id"),
  );

  const { post, comments, errorMessage, isLoading, isValidPostId, refresh } = useBoardDetail(postId);
  const [ commentContent, setCommentContent ] = useState("");
  const [ selectedCommentId, setSelectedCommentId ] = useState(null);
  const {value: isSubmitting, setTrue: startSubmitting, setFalse: finishSubmitting} = useBooleanState(false);
  const {value: isDeleting, setTrue: startDeleting, setFalse: finishDeleting} = useBooleanState(false);

  useEffect(() => {
    document.title = "게시글 상세";
  }, []);

  const handleDeletePost = async () => {
    const confirmed = window.confirm(
      "게시글을 삭제하시겠습니까?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBoardRequest(postId);
      navigate(BOARD_LIST_PATH);
    } catch (error) {
      window.alert(
        error.message ||
          "게시글 삭제에 실패했습니다.",
      );
    }
  };

  const handleCreateComment = async () => {
    const content = commentContent.trim();

    if (!content) {
      window.alert(
        "댓글을 입력해주세요.",
      );
      return;
    }

    if (isSubmitting) {
      return;
    }

    try {
      startSubmitting();

      await createCommentRequest(
        postId,
        { content },
      );

      setCommentContent("");
      await refresh();
    } catch (error) {
      window.alert(
        error.message ||
          "댓글 등록에 실패했습니다.",
      );
    } finally {
      finishSubmitting();
    }
  };

  const handleEditComment =
    async (comment) => {
      const input = window.prompt(
        "댓글을 수정해주세요.",
        comment.content,
      );

      if (input === null) {
        return;
      }

      const content = input.trim();

      if (!content) {
        window.alert(
          "댓글 내용을 입력해주세요.",
        );
        return;
      }

      try {
        await updateCommentRequest(
          postId,
          comment.id,
          { content },
        );

        await refresh();
      } catch (error) {
        window.alert(
          error.message ||
            "댓글 수정에 실패했습니다.",
        );
      }
    };

  const handleDeleteComment =
    async () => {
      if (
        selectedCommentId === null ||
        isDeleting
      ) {
        return;
      }

      try {
        startDeleting();

        await deleteCommentRequest(
          postId,
          selectedCommentId,
        );

        setSelectedCommentId(null);
        await refresh();
      } catch (error) {
        window.alert(
          error.message ||
            "댓글 삭제에 실패했습니다.",
        );
      } finally {
        finishDeleting();
      }
    };

  return (
    <>
      <Header type="withBackAndProfile" />

      <Modal
        id="deleteCommentModal"
        isOpen={ selectedCommentId !== null }
        title="댓글을 삭제하시겠습니까?"
        description="삭제한 내용은 복구할 수 없습니다."
        cancelText="취소"
        confirmText={ isDeleting ? "삭제 중..." : "확인" }
        onCancel={() => { if (!isDeleting) setSelectedCommentId(null) }}
        onConfirm={ handleDeleteComment }
      />

      <main className="detail">
        <section className="detail-container">
          {!isValidPostId && (
            <p className="detail__error">올바르지 않은 게시글 번호입니다.</p>
          )}
          {isLoading && (
            <p className="detail__loading">게시글을 불러오는 중입니다.</p>
          )}
          {!isLoading &&
            errorMessage && (
              <p className="detail__error">{errorMessage}</p>
          )}

          {!isLoading && !errorMessage && post &&
            (
              <>
                <PostContent
                  post={post}
                  onEdit={() => navigate(getEditPath(postId))}
                  onDelete={handleDeletePost}
                />

                <div className="comment-form">
                  <textarea
                    className="comment-form__textarea"
                    placeholder="댓글을 남겨주세요!"
                    value={commentContent}
                    onChange={(event) => setCommentContent(event.target.value)}
                  />

                  <div className="comment-form__button-outline">
                    <button
                      className="comment-form__button"
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleCreateComment}
                    >
                      {isSubmitting ? "등록 중..." : "댓글 등록"}
                    </button>
                  </div>
                </div>

                <div className="comment-list">
                  {!comments.length && (
                    <p className="comment-list__empty">등록된 댓글이 없습니다.</p>
                  )}

                  {comments.map(
                    (comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        onEdit={handleEditComment}
                        onDelete={setSelectedCommentId}
                      />
                    ),
                  )}
                </div>
              </>
            )}
        </section>
      </main>
    </>
  );
}

export default BoardDetailPage;