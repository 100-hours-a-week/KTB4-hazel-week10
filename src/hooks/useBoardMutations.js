import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cancelVote, createBoard, deleteBoard, updateBoard, voteBoard } from "@/api/boardApi.js";
import boardQueries from "@/queryFactory/boardQueries.js";

function invalidateBoardLists(queryClient) {
  queryClient.invalidateQueries({
    queryKey: boardQueries.listKeys(),
  });
  queryClient.invalidateQueries({
    queryKey: boardQueries.selectedListKeys(),
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      invalidateBoardLists(queryClient);
    },
  });
}

export function useUpdateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, data }) => updateBoard(boardId, data),
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({
        queryKey: boardQueries.detailKeys(boardId),
      });
      invalidateBoardLists(queryClient);
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBoard,
    onSuccess: (_, boardId) => {
      queryClient.removeQueries({
        queryKey: boardQueries.detailKeys(boardId),
      });
      invalidateBoardLists(queryClient);
    },
  });
}

export function useVoteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, voteType }) => voteBoard(boardId, voteType),
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({
        queryKey: boardQueries.detailKeys(boardId),
      });
      invalidateBoardLists(queryClient);
    },
  });
}

export function useCancelVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelVote,
    onSuccess: (_, boardId) => {
      queryClient.invalidateQueries({
        queryKey: boardQueries.detailKeys(boardId),
      });
      invalidateBoardLists(queryClient);
    },
  });
}
