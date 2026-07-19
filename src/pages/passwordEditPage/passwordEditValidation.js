import { isValidPassword } from "../../utils/validation/validators.js";
import { INITIAL_ERRORS } from "./initialState.js";

export function normalizePasswordForm(form) {
  return {
    currentPassword: form.currentPassword.trim(),
    newPassword: form.newPassword.trim(),
    newPasswordConfirm: form.newPasswordConfirm.trim(),
  };
}

export function validatePasswordForm(form) {
  const errors = { ...INITIAL_ERRORS };

  if (!form.currentPassword) {
    errors.currentPassword = "현재 비밀번호를 입력해주세요.";
    return errors;
  }

  if (!form.newPassword) {
    errors.newPassword = "새 비밀번호를 입력해주세요.";
    return errors;
  }

  if (!isValidPassword(form.newPassword)) {
    errors.newPassword =
      "비밀번호는 8자 이상 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    return errors;
  }

  if (!form.newPasswordConfirm) {
    errors.newPasswordConfirm = "새 비밀번호를 한번 더 입력해주세요.";
    return errors;
  }

  if (form.newPassword !== form.newPasswordConfirm) {
    errors.newPasswordConfirm = "비밀번호가 다릅니다.";
  }

  return errors;
}

export function hasValidationError(errors) {
  return Object.values(errors).some(Boolean);
}