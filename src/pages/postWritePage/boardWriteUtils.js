import { INITIAL_ERRORS } from "./initialState.js";

export function normalizeBoardForm(form) {
  return {
    title: form.title.trim(),
    category: form.category,
    content: form.content.trim(),
  };
}

export function validateBoardForm(form) {
  const errors = { ...INITIAL_ERRORS };

  if (!form.title) {
    errors.title = "제목을 입력해주세요.";
    return errors;
  }

  if (!form.category) {
    errors.category = "카테고리를 선택해주세요.";
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

export function createBoardFormData(form, images) {
  const formData = new FormData();

  formData.append("title", form.title);
  formData.append("category", form.category);
  formData.append("text", form.content);

  images.forEach((image) => {
    formData.append("images", image);
  });

  return formData;
}