import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import Header from "../../components/header/index.jsx";
import Modal from "../../components/modal/index.jsx";
import { useCancelVote, useDeleteBoard, useVoteBoard } from "@/hooks/useBoardMutations.js";
import { useCreateComment, useDeleteComment, useUpdateComment } from "@/hooks/useCommentMutations.js";

import PostContent from "./components/PostContent.jsx";
import CommentItem from "./components/CommentItem.jsx";
import BoardDetailSkeleton from "./components/BoardDetailSkeleton.jsx";
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
  const [ isPostDeleteModalOpen, setIsPostDeleteModalOpen ] = useState(false);

  const deleteBoardMutation = useDeleteBoard();
  const voteMutation = useVoteBoard();
  const cancelVoteMutation = useCancelVote();
  const createCommentMutation = useCreateComment();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();

  const isSubmitting = createCommentMutation.isPending;
  const isDeleting =
    deleteBoardMutation.isPending || deleteCommentMutation.isPending;

  useEffect(() => {
    document.title = "질문 상세";
  }, []);

  const handleDeletePost = () => {
    if (isDeleting) {
      return;
    }

    setIsPostDeleteModalOpen(true);
  };

  const handleConfirmDeletePost = async () => {
    if (isDeleting) {
      return;
    }

    try {
      await deleteBoardMutation.mutateAsync(postId);
      setIsPostDeleteModalOpen(false);
      navigate(BOARD_LIST_PATH);
    } catch (error) {
      window.alert(
        error.message ||
          "질문 삭제에 실패했습니다.",
      );
    }
  };

  const handleVote = async (voteType) => {
    if (!post) {
      return;
    }

    try {
      if (post.myVoteType === voteType) {
        await cancelVoteMutation.mutateAsync(postId);
      } else {
        // 찬성 <-> 반대 변경도 서버가 한 번에 처리한다.
        await voteMutation.mutateAsync({
          boardId: postId,
          voteType,
        });
      }
    } catch (error) {
      window.alert(
        error.message ||
          "투표에 실패했습니다.",
      );

      // 실패 지점에 따라 서버 상태를 알 수 없으므로 캐시를 다시 확인한다.
      await refresh().catch(() => {});
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
      await createCommentMutation.mutateAsync({
        boardId: postId,
        data: { content },
      });

      setCommentContent("");
    } catch (error) {
      window.alert(
        error.message ||
          "댓글 등록에 실패했습니다.",
      );
    }
  };

  const handleEditComment =
    async (comment, content) => {
      try {
        await updateCommentMutation.mutateAsync({
          boardId: postId,
          commentId: comment.id,
          data: { content },
        });
      } catch (error) {
        window.alert(
          error.message ||
            "댓글 수정에 실패했습니다.",
        );

        throw error;
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
        await deleteCommentMutation.mutateAsync({
          boardId: postId,
          commentId: selectedCommentId,
        });

        setSelectedCommentId(null);
      } catch (error) {
        window.alert(
          error.message ||
            "댓글 삭제에 실패했습니다.",
        );
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

      <Modal
        id="deletePostModal"
        isOpen={ isPostDeleteModalOpen }
        title="질문을 삭제하시겠습니까?"
        description="삭제한 내용은 복구할 수 없습니다."
        cancelText="취소"
        confirmText={ isDeleting ? "삭제 중..." : "확인" }
        onCancel={() => { if (!isDeleting) setIsPostDeleteModalOpen(false) }}
        onConfirm={ handleConfirmDeletePost }
      />

      <main className="detail">
        <section className="detail-container">
          {!isValidPostId && (
            <p className="detail__error">올바르지 않은 질문 번호입니다.</p>
          )}
          {isLoading && <BoardDetailSkeleton />}
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
                  onVote={handleVote}
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
