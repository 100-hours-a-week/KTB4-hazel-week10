import { useQuery, useQueryClient } from "@tanstack/react-query";

import boardQueries from "@/queryFactory/boardQueries.js";
import commentQueries from "@/queryFactory/commentQueries.js";

function getPost(response) {
  return response?.data ?? null;
}

function getComments(response) {
  return response?.data?.comments ?? response?.data ?? [];
}

export default function useBoardDetail(postId) {
  const queryClient = useQueryClient();
  const isValidPostId = Number.isInteger(postId) && postId > 0;

  const boardQuery = useQuery(boardQueries.detail(postId));
  const commentQuery = useQuery(commentQueries.list(postId));

  const refresh = async () => {
    if (!isValidPostId) {
      return;
    }

    const [detailData, commentsData] = await Promise.all([
      queryClient.fetchQuery(boardQueries.detail(postId, false)),
      queryClient.fetchQuery(commentQueries.list(postId)),
    ]);

    queryClient.setQueryData(
      boardQueries.detail(postId).queryKey,
      detailData,
    );
    queryClient.setQueryData(
      commentQueries.listKeys(postId),
      commentsData,
    );
  };

  const error = boardQuery.error || commentQuery.error;

  return {
    post: getPost(boardQuery.data),
    comments: getComments(commentQuery.data),
    errorMessage: error?.message || "",
    isLoading: isValidPostId && (boardQuery.isPending || commentQuery.isPending),
    isValidPostId,
    refresh,
  };
}
