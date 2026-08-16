import { queryOptions } from "@tanstack/react-query";

import { getBoardDetail, getBoards, getSelectedBoards } from "../api/boardApi.js";

const boardQueries = {
  allKeys: () => ["boards"],

  listKeys: () => [...boardQueries.allKeys(), "list"],
  list: (page = 0, size = 10, category = "") =>
    queryOptions({
      queryKey: [...boardQueries.listKeys(), { page, size, category }],
      queryFn: () => getBoards(page, size, category),
    }),

  selectedListKeys: () => [...boardQueries.allKeys(), "selected"],
  selectedList: (page = 0, size = 10, category = "") =>
    queryOptions({
      queryKey: [
        ...boardQueries.selectedListKeys(),
        { page, size, category },
      ],
      queryFn: () => getSelectedBoards(page, size, category),
    }),

  detailKeys: (boardId) => [...boardQueries.allKeys(), "detail", boardId],
  detail: (boardId, countView = true) =>
    queryOptions({
      queryKey: [
        ...boardQueries.detailKeys(boardId),
        { countView },
      ],
      queryFn: () => getBoardDetail(boardId, countView),
      enabled: Number.isInteger(boardId) && boardId > 0,
    }),
};

export default boardQueries;
