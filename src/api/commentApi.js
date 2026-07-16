import { request } from "./http.js";

export function getCommentsRequest(boardId) {
  return request(`/boards/${boardId}/comments`, {
    method: "GET",
  });
}

export function createCommentRequest(boardId, data) {
  return request(`/boards/${boardId}/comments`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCommentRequest(boardId, commentId, data) {
  return request(`/boards/${boardId}/comments/${commentId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteCommentRequest(boardId, commentId) {
  return request(`/boards/${boardId}/comments/${commentId}`, {
    method: "DELETE",
  });
}