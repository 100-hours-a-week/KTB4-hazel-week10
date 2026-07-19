import { INITIAL_ERRORS } from "./initialState.js";

export function normalizeEditForm(form) {
  return {
    title: form.title.trim(),
    content: form.content.trim(),
  };
}

export function validateEditForm(form) {
  const errors = { ...INITIAL_ERRORS };

  if (!form.title) {
    errors.title = "제목을 입력해주세요.";
    return errors;
  }

  if (!form.content) {
    errors.content = "내용을 입력해주세요.";
  }

  return errors;
}

export function hasValidationError(errors) {
  return Object.values(errors).some(Boolean);
}

export function createBoardFormData({ form, currentImages, newImages }) {
  const formData = new FormData();

  formData.append("title", form.title);
  formData.append("text", form.content);

  const images = newImages.length ? newImages : currentImages;

  images.forEach((image) => {
    formData.append("images", image);
  });

  return formData;
}

export function getImageFileText(currentImages, newImages) {
  if (newImages.length) {
    return `${newImages.length}개의 새 이미지 선택됨`;
  }

  if (currentImages.length) {
    return `${currentImages.length}개의 기존 이미지`;
  }

  return "파일을 선택해주세요.";
}