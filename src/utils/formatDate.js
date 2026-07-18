export function formatDate(dataTimeString) {
  return dataTimeString.split(".")[0].replace("T", " ");
}