import apiClient from "./http.js";

export async function getCommentsRequest(boardId) {
  const response = await apiClient.get(`/boards/${boardId}/comments`);

  return response.data;
}

export async function createCommentRequest(boardId, data) {
  const response = await apiClient.post(`/boards/${boardId}/comments`, data);

  return response.data;
}

export async function updateCommentRequest(boardId, commentId, data) {
  const response = await apiClient.patch(
    `/boards/${boardId}/comments/${commentId}`,
    data,
  );

  return response.data;
}

export async function deleteCommentRequest(boardId, commentId) {
  const response = await apiClient.delete(
    `/boards/${boardId}/comments/${commentId}`,
  );

  return response.data;
}
