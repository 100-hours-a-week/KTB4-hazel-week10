import { request } from "./http.js";

export function getBoardsRequest(page = 0, size = 10, category = "") {
  const categoryQuery = category ? `&category=${category}` : "";

  return request(`/boards?page=${page}&size=${size}${categoryQuery}`, {
    method: "GET",
  });
}

export function getSelectedBoardsRequest(page = 0, size = 10, category = "") {
  const categoryQuery = category ? `&category=${category}` : "";

  return request(`/boards/selected?page=${page}&size=${size}${categoryQuery}`, {
    method: "GET",
  });
}

export function getBoardDetailRequest(boardId, countView = true) {
  return request(`/boards/${boardId}?countView=${countView}`, {
    method: "GET",
  });
}

export function updateBoardRequest(boardId, data) {
  return request(`/boards/${boardId}`, {
    method: "PATCH",
    body: data,
  });
}

export function createBoardRequest(data) {
  return request("/boards", {
    method: "POST",
    body: data,
  });
}

export function deleteBoardRequest(boardId) {
  return request(`/boards/${boardId}`, {
    method: "DELETE",
  });
}

export function voteBoardRequest(boardId, voteType) {
  return request(`/boards/${boardId}/votes`, {
    method: "POST",
    body: JSON.stringify({ voteType }),
  });
}

export function cancelVoteRequest(boardId) {
  return request(`/boards/${boardId}/votes`, {
    method: "DELETE",
  });
}
