import { queryOptions } from "@tanstack/react-query";

import { getCommentsRequest } from "../api/commentApi.js";

const commentQueries = {
  allKeys: () => ["comments"],

  listKeys: (boardId) => [
    ...commentQueries.allKeys(),
    "list",
    boardId,
  ],

  list: (boardId) =>
    queryOptions({
      queryKey: commentQueries.listKeys(boardId),
      queryFn: () => getCommentsRequest(boardId),
      enabled: Number.isInteger(boardId) && boardId > 0,
    }),
};

export default commentQueries;
