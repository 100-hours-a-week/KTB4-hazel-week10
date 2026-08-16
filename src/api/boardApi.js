import apiClient from "./http.js";

export async function getBoards(page = 0, size = 10, category = "") {
  const categoryQuery = category ? `&category=${category}` : "";
  const response = await apiClient.get(
    `/boards?page=${page}&size=${size}${categoryQuery}`,
  );

  return response.data;
}

export async function getSelectedBoards(page = 0, size = 10, category = "") {
  const categoryQuery = category ? `&category=${category}` : "";
  const response = await apiClient.get(
    `/boards/selected?page=${page}&size=${size}${categoryQuery}`,
  );

  return response.data;
}

export async function getBoardDetail(boardId, countView = true) {
  const response = await apiClient.get(
    `/boards/${boardId}?countView=${countView}`,
  );

  return response.data;
}

export async function updateBoard(boardId, data) {
  const response = await apiClient.patch(`/boards/${boardId}`, data);

  return response.data;
}

export async function createBoard(data) {
  const response = await apiClient.post("/boards", data);

  return response.data;
}

export async function deleteBoard(boardId) {
  const response = await apiClient.delete(`/boards/${boardId}`);

  return response.data;
}

export async function voteBoard(boardId, voteType) {
  const response = await apiClient.post(`/boards/${boardId}/votes`, {
    voteType,
  });

  return response.data;
}

export async function cancelVote(boardId) {
  const response = await apiClient.delete(`/boards/${boardId}/votes`);

  return response.data;
}

export const getBoardsRequest = getBoards;
export const getSelectedBoardsRequest = getSelectedBoards;
export const getBoardDetailRequest = getBoardDetail;
export const updateBoardRequest = updateBoard;
export const createBoardRequest = createBoard;
export const deleteBoardRequest = deleteBoard;
export const voteBoardRequest = voteBoard;
export const cancelVoteRequest = cancelVote;
