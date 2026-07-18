import { BASE_URL } from "../api/http.js";

export function resolveImageUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }

  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
