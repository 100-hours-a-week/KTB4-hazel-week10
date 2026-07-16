import { request } from "./http.js";

export function getBoardsRequest() {
  return request("/boards", {
    method: "GET",
  });
}

export function getBoardDetailRequest(boardId) {
  return request(`/boards/${boardId}`, {
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
