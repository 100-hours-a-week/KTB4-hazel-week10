import {
  getBoardDetailRequest,
} from "../../api/boardApi.js";

import {
  getCommentsRequest,
} from "../../api/commentApi.js";

function getComments(response) {
  return (
    response.data?.comments ??
    response.data ??
    []
  );
}

export async function fetchBoardDetail(
  postId,
) {
  const [
    postResponse,
    commentResponse,
  ] = await Promise.all([
    getBoardDetailRequest(postId),
    getCommentsRequest(postId),
  ]);

  return {
    post: postResponse.data,
    comments:
      getComments(commentResponse),
  };
}