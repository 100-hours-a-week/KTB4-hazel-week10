import { INITIAL_ERRORS } from "./initialState.js";

import {
  isValidEmail,
  isValidPassword,
} from "../../utils/validation/signupValidation.js";

export function normalizeSignupForm(form) {
  return {
    email: form.email.trim(),
    password: form.password.trim(),
    passwordConfirm: form.passwordConfirm.trim(),
    nickname: form.nickname.trim(),
  };
}

export function validateSignupForm(form, profileImage) {
  const errors = {
    ...INITIAL_ERRORS,
  };

  if (!form.email) {
    errors.email = "이메일을 입력해주세요.";
    return errors;
  }

  if (!isValidEmail(form.email)) {
    errors.email = "이메일 주소 형식을 입력해주세요.";
    return errors;
  }

  if (!form.password) {
    errors.password = "비밀번호를 입력해주세요.";
    return errors;
  }

  if (!isValidPassword(form.password)) {
    errors.password =
      "비밀번호는 8자 이상 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";

    return errors;
  }

  if (!form.passwordConfirm) {
    errors.passwordConfirm =
      "비밀번호를 한번 더 입력해주세요.";

    return errors;
  }

  if (form.password !== form.passwordConfirm) {
    errors.passwordConfirm = "비밀번호가 다릅니다.";
    return errors;
  }

  if (!form.nickname) {
    errors.nickname = "닉네임을 입력해주세요.";
    return errors;
  }

  if (!profileImage) {
    errors.profileImage = "프로필 사진을 추가해주세요.";
  }

  return errors;
}

export function hasValidationError(errors) {
  return Object.values(errors).some(Boolean);
}

export function createSignupFormData(form, profileImage) {
  const formData = new FormData();

  formData.append("email", form.email);
  formData.append("password", form.password);
  formData.append("nickname", form.nickname);
  formData.append("profileImage", profileImage);

  return formData;
}