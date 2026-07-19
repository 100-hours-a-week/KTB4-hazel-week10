export function createUserEditFormData(nickname, profileImage) {
  const formData = new FormData();

  formData.append("nickname", nickname);

  if (profileImage) {
    formData.append("profileImage", profileImage);
  }

  return formData;
}

export function clearAuthData() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("tokenType");
  localStorage.removeItem("userId");
}