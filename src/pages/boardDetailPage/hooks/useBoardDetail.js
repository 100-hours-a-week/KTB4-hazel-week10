import {
  useEffect,
  useState,
} from "react";

import {
  fetchBoardDetail,
} from "../detailService.js";

const INITIAL_DETAIL = {
  loadedPostId: null,
  post: null,
  comments: [],
  errorMessage: "",
};

export default function useBoardDetail(
  postId,
) {
  const [detail, setDetail] =
    useState(INITIAL_DETAIL);

  const isValidPostId =
    Number.isInteger(postId) &&
    postId > 0;

  useEffect(() => {
    if (!isValidPostId) {
      return undefined;
    }

    let isCancelled = false;

    fetchBoardDetail(postId)
      .then((data) => {
        if (isCancelled) {
          return;
        }

        setDetail({
          loadedPostId: postId,
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
          loadedPostId: postId,
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

  const refresh = async () => {
    const data =
      await fetchBoardDetail(postId);

    setDetail({
      loadedPostId: postId,
      post: data.post,
      comments: data.comments,
      errorMessage: "",
    });
  };

  const isLoading =
    isValidPostId &&
    detail.loadedPostId !== postId;

  return {
    post:
      detail.loadedPostId === postId
        ? detail.post
        : null,

    comments:
      detail.loadedPostId === postId
        ? detail.comments
        : [],

    errorMessage:
      detail.loadedPostId === postId
        ? detail.errorMessage
        : "",

    isLoading,
    isValidPostId,
    refresh,
  };
}