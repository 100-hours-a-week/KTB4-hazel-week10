import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import Header from "../../components/header/index.jsx";
import Modal from "../../components/modal/index.jsx";

import {
  deleteBoardRequest,
  getBoardDetailRequest,
} from "../../api/boardApi.js";

import {
  createCommentRequest,
  deleteCommentRequest,
  getCommentsRequest,
  updateCommentRequest,
} from "../../api/commentApi.js";

import { formatDate } from "../../utils/formatDate.js";
import { resolveImageUrl } from "../../utils/resolveImageUrl.js";

import "./index.css";

const BOARD_LIST_PATH = "/boards";

const INITIAL_DETAIL = {
  postId: null,
  post: null,
  comments: [],
  errorMessage: "",
};

function getBoardEditPath(postId) {
  return `/boards/${postId}/edit`;
}

function getCommentsFromResponse(response) {
  return (
    response.data?.comments ??
    response.data ??
    []
  );
}

async function fetchDetailData(postId) {
  const [
    postResponse,
    commentsResponse,
  ] = await Promise.all([
    getBoardDetailRequest(postId),
    getCommentsRequest(postId),
  ]);

  return {
    post: postResponse.data,
    comments:
      getCommentsFromResponse(
        commentsResponse,
      ),
  };
}

function handleImageError(event) {
  event.currentTarget.removeAttribute("src");
}

function PostImages({ images = [] }) {
  if (!images.length) {
    return null;
  }

  return (
    <div className="detail__image-list">
      {images.map((imageUrl, index) => {
        const resolvedImageUrl =
          resolveImageUrl(imageUrl);

        return (
          <img
            key={`${imageUrl}-${index}`}
            className="detail__image"
            src={resolvedImageUrl || undefined}
            alt={`게시글 이미지 ${index + 1}`}
            onError={handleImageError}
          />
        );
      })}
    </div>
  );
}

function CommentItem({
  comment,
  onEdit,
  onDelete,
}) {
  const {
    id,
    writer,
    writerProfileImage,
    createdAt,
    content,
    isOwner,
  } = comment;

  const profileImageUrl =
    resolveImageUrl(writerProfileImage);

  return (
    <div
      className="comment-item"
      data-comment-id={id}
    >
      <img
        className="profile__image"
        src={profileImageUrl || undefined}
        alt=""
        onError={handleImageError}
      />

      <div className="comment-item__content">
        <div className="comment-item__meta">
          <span className="comment-item__author">
            {writer}
          </span>

          <span className="comment-item__date">
            {formatDate(createdAt)}
          </span>

          {isOwner && (
            <div className="comment-item__button-container">
              <button
                className="detail__button comment-edit-button"
                type="button"
                onClick={() => onEdit(comment)}
              >
                수정
              </button>

              <button
                className="detail__button comment-delete-button"
                type="button"
                onClick={() => onDelete(id)}
              >
                삭제
              </button>
            </div>
          )}
        </div>

        <p className="comment-item__text">
          {content}
        </p>
      </div>
    </div>
  );
}

function BoardDetailPage() {
  const navigate = useNavigate();

  const { postId: pathPostId } =
    useParams();

  const [searchParams] =
    useSearchParams();

  // /boards/1과 /detail?id=1 방식을 모두 지원합니다.
  const postId = Number(
    pathPostId ??
      searchParams.get("id"),
  );

  const isValidPostId =
    Number.isInteger(postId) &&
    postId > 0;

  const [detail, setDetail] =
    useState(INITIAL_DETAIL);

  const [
    commentContent,
    setCommentContent,
  ] = useState("");

  const [
    selectedDeleteCommentId,
    setSelectedDeleteCommentId,
  ] = useState(null);

  const [
    isCommentSubmitting,
    setIsCommentSubmitting,
  ] = useState(false);

  const [
    isCommentDeleting,
    setIsCommentDeleting,
  ] = useState(false);

  const isLoading =
    isValidPostId &&
    detail.postId !== postId;

  const post =
    detail.postId === postId
      ? detail.post
      : null;

  const comments =
    detail.postId === postId
      ? detail.comments
      : [];

  const errorMessage =
    detail.postId === postId
      ? detail.errorMessage
      : "";

  useEffect(() => {
    document.title = "게시글 상세";
  }, []);

  useEffect(() => {
    if (!isValidPostId) {
      return undefined;
    }

    let isCancelled = false;

    fetchDetailData(postId)
      .then((data) => {
        if (isCancelled) {
          return;
        }

        setDetail({
          postId,
          post: data.post,
          comments: data.comments,
          errorMessage: "",
        });
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }

        console.error(
          "게시글 상세 조회 실패:",
          error,
        );

        setDetail({
          postId,
          post: null,
          comments: [],
          errorMessage:
            error.message ||
            "게시글을 불러오지 못했습니다.",
        });
      });

    return () => {
      isCancelled = true;
    };
  }, [postId, isValidPostId]);

  const refreshDetail = async () => {
    const data =
      await fetchDetailData(postId);

    setDetail({
      postId,
      post: data.post,
      comments: data.comments,
      errorMessage: "",
    });
  };

  const handleEditPost = () => {
    navigate(
      getBoardEditPath(postId),
    );
  };

  const handleDeletePost = async () => {
    const isConfirmed =
      window.confirm(
        "게시글을 삭제하시겠습니까?",
      );

    if (!isConfirmed) {
      return;
    }

    try {
      await deleteBoardRequest(postId);
      navigate(BOARD_LIST_PATH);
    } catch (error) {
      console.error(
        "게시글 삭제 실패:",
        error,
      );

      window.alert(
        error.message ||
        "게시글 삭제에 실패했습니다.",
      );
    }
  };

  const handleCreateComment =
    async () => {
      const content =
        commentContent.trim();

      if (!content) {
        window.alert(
          "댓글을 입력해주세요.",
        );
        return;
      }

      if (isCommentSubmitting) {
        return;
      }

      try {
        setIsCommentSubmitting(true);

        await createCommentRequest(
          postId,
          { content },
        );

        setCommentContent("");
        await refreshDetail();
      } catch (error) {
        console.error(
          "댓글 등록 실패:",
          error,
        );

        window.alert(
          error.message ||
          "댓글 등록에 실패했습니다.",
        );
      } finally {
        setIsCommentSubmitting(false);
      }
    };

  const handleEditComment =
    async (comment) => {
      const nextContent =
        window.prompt(
          "댓글을 수정해주세요.",
          comment.content,
        );

      if (nextContent === null) {
        return;
      }

      const content =
        nextContent.trim();

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

        await refreshDetail();
      } catch (error) {
        console.error(
          "댓글 수정 실패:",
          error,
        );

        window.alert(
          error.message ||
          "댓글 수정에 실패했습니다.",
        );
      }
    };

  const handleOpenDeleteCommentModal = (
    commentId,
  ) => {
    setSelectedDeleteCommentId(
      commentId,
    );
  };

  const handleCloseDeleteCommentModal =
    () => {
      if (isCommentDeleting) {
        return;
      }

      setSelectedDeleteCommentId(
        null,
      );
    };

  const handleDeleteComment =
    async () => {
      if (
        selectedDeleteCommentId ===
          null ||
        isCommentDeleting
      ) {
        return;
      }

      try {
        setIsCommentDeleting(true);

        await deleteCommentRequest(
          postId,
          selectedDeleteCommentId,
        );

        setSelectedDeleteCommentId(
          null,
        );

        await refreshDetail();
      } catch (error) {
        console.error(
          "댓글 삭제 실패:",
          error,
        );

        window.alert(
          error.message ||
          "댓글 삭제에 실패했습니다.",
        );
      } finally {
        setIsCommentDeleting(false);
      }
    };

  return (
    <>
      <Header type="withBackAndProfile" />

      <Modal
        id="deleteCommentModal"
        isOpen={
          selectedDeleteCommentId !==
          null
        }
        title="댓글을 삭제하시겠습니까?"
        description="삭제한 내용은 복구할 수 없습니다."
        cancelText="취소"
        confirmText={
          isCommentDeleting
            ? "삭제 중..."
            : "확인"
        }
        onCancel={
          handleCloseDeleteCommentModal
        }
        onConfirm={
          handleDeleteComment
        }
      />

      <main className="detail">
        <section
          id="postDetail"
          className="detail-container"
        >
          {!isValidPostId && (
            <p className="detail__error">
              올바르지 않은 게시글
              번호입니다.
            </p>
          )}

          {isLoading && (
            <p className="detail__loading">
              게시글을 불러오는
              중입니다.
            </p>
          )}

          {!isLoading &&
            errorMessage && (
              <p className="detail__error">
                {errorMessage}
              </p>
            )}

          {!isLoading &&
            !errorMessage &&
            post && (
              <>
                <h2 className="detail__title">
                  {post.title}
                </h2>

                <div className="detail__meta">
                  <div className="detail__mate-container">
                    <div className="profile-container">
                      <img
                        className="profile__image"
                        src={
                          resolveImageUrl(
                            post.writerProfileImage,
                          ) ||
                          undefined
                        }
                        alt=""
                        onError={
                          handleImageError
                        }
                      />

                      <div className="profile__name">
                        {post.writer}
                      </div>
                    </div>

                    <span className="detail__date">
                      {formatDate(
                        post.createdAt,
                      )}
                    </span>
                  </div>

                  {post.isOwner && (
                    <div className="detail__button-container">
                      <button
                        id="editButton"
                        className="detail__button"
                        type="button"
                        onClick={
                          handleEditPost
                        }
                      >
                        수정
                      </button>

                      <button
                        id="deleteButton"
                        className="detail__button"
                        type="button"
                        onClick={
                          handleDeletePost
                        }
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>

                <div className="line" />

                <PostImages
                  images={post.images}
                />

                <p className="detail__content">
                  {post.text}
                </p>

                <div className="detail__count-container">
                  <div className="detail__count-box">
                    <strong>
                      {post.likeCount}
                    </strong>

                    <span>좋아요수</span>
                  </div>

                  <div className="detail__count-box">
                    <strong>
                      {post.views}
                    </strong>

                    <span>조회수</span>
                  </div>

                  <div className="detail__count-box">
                    <strong>
                      {post.comments}
                    </strong>

                    <span>댓글</span>
                  </div>
                </div>

                <div className="line" />

                <div className="comment-form">
                  <textarea
                    id="commentContent"
                    className="comment-form__textarea"
                    placeholder="댓글을 남겨주세요!"
                    value={
                      commentContent
                    }
                    onChange={(
                      event,
                    ) => {
                      setCommentContent(
                        event.target
                          .value,
                      );
                    }}
                  />

                  <div className="comment-form__button-outline">
                    <button
                      id="commentSubmitButton"
                      className="comment-form__button"
                      type="button"
                      disabled={
                        isCommentSubmitting
                      }
                      onClick={
                        handleCreateComment
                      }
                    >
                      {isCommentSubmitting
                        ? "등록 중..."
                        : "댓글 등록"}
                    </button>
                  </div>
                </div>

                <div
                  id="commentList"
                  className="comment-list"
                >
                  {comments.length ===
                    0 && (
                    <p className="comment-list__empty">
                      등록된 댓글이
                      없습니다.
                    </p>
                  )}

                  {comments.map(
                    (comment) => (
                      <CommentItem
                        key={
                          comment.id
                        }
                        comment={
                          comment
                        }
                        onEdit={
                          handleEditComment
                        }
                        onDelete={
                          handleOpenDeleteCommentModal
                        }
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