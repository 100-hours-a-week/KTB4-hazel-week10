import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCommentRequest, deleteCommentRequest, updateCommentRequest } from "@/api/commentApi.js";
import boardQueries from "@/queryFactory/boardQueries.js";
import commentQueries from "@/queryFactory/commentQueries.js";

function invalidateCommentQueries(queryClient, boardId) {
  queryClient.invalidateQueries({
    queryKey: commentQueries.listKeys(boardId),
  });
  queryClient.invalidateQueries({
    queryKey: boardQueries.detailKeys(boardId),
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, data }) => createCommentRequest(boardId, data),
    onSuccess: (_, { boardId }) => {
      invalidateCommentQueries(queryClient, boardId);
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, commentId, data }) =>
      updateCommentRequest(boardId, commentId, data),
    onSuccess: (_, { boardId }) => {
      invalidateCommentQueries(queryClient, boardId);
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, commentId }) =>
      deleteCommentRequest(boardId, commentId),
    onSuccess: (_, { boardId }) => {
      invalidateCommentQueries(queryClient, boardId);
    },
  });
}
