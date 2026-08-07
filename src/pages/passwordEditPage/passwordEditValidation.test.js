import {
  hasValidationError,
  normalizePasswordForm,
  validatePasswordForm,
} from "./passwordEditValidation.js";

const VALID_FORM = {
  currentPassword: "Current1!",
  newPassword: "Newpass1!",
  newPasswordConfirm: "Newpass1!",
};

const NO_ERROR = {
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
};

describe("normalizePasswordForm", () => {
  it("모든 비밀번호 입력값의 앞뒤 공백을 제거한다", () => {
    const result = normalizePasswordForm({
      currentPassword: " Current1! ",
      newPassword: " Newpass1! ",
      newPasswordConfirm: " Newpass1! ",
    });

    expect(result).toEqual(VALID_FORM);
  });

  it("원본 폼 객체를 변경하지 않는다", () => {
    const form = {
      currentPassword: " Current1! ",
      newPassword: " Newpass1! ",
      newPasswordConfirm: " Newpass1! ",
    };

    normalizePasswordForm(form);

    expect(form.currentPassword).toBe(" Current1! ");
    expect(form.newPassword).toBe(" Newpass1! ");
  });
});

describe("validatePasswordForm", () => {
  it("모든 입력이 유효하면 빈 에러 객체를 반환한다", () => {
    expect(validatePasswordForm(VALID_FORM)).toEqual(NO_ERROR);
  });

  it("현재 비밀번호가 비어 있으면 입력 에러를 반환한다", () => {
    const errors = validatePasswordForm({
      ...VALID_FORM,
      currentPassword: "",
    });

    expect(errors).toEqual({
      ...NO_ERROR,
      currentPassword: "현재 비밀번호를 입력해주세요.",
    });
  });

  it("새 비밀번호가 비어 있으면 입력 에러를 반환한다", () => {
    const errors = validatePasswordForm({
      ...VALID_FORM,
      newPassword: "",
      newPasswordConfirm: "",
    });

    expect(errors).toEqual({
      ...NO_ERROR,
      newPassword: "새 비밀번호를 입력해주세요.",
    });
  });

  it("새 비밀번호가 정책에 맞지 않으면 정책 에러를 반환한다", () => {
    const errors = validatePasswordForm({
      ...VALID_FORM,
      newPassword: "password",
      newPasswordConfirm: "password",
    });

    expect(errors).toEqual({
      ...NO_ERROR,
      newPassword:
        "비밀번호는 8자 이상 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.",
    });
  });

  it("새 비밀번호 확인이 비어 있으면 재입력 에러를 반환한다", () => {
    const errors = validatePasswordForm({
      ...VALID_FORM,
      newPasswordConfirm: "",
    });

    expect(errors).toEqual({
      ...NO_ERROR,
      newPasswordConfirm: "새 비밀번호를 한번 더 입력해주세요.",
    });
  });

  it("새 비밀번호와 확인 값이 다르면 불일치 에러를 반환한다", () => {
    const errors = validatePasswordForm({
      ...VALID_FORM,
      newPasswordConfirm: "Different1!",
    });

    expect(errors).toEqual({
      ...NO_ERROR,
      newPasswordConfirm: "비밀번호가 다릅니다.",
    });
  });

  it("여러 입력이 잘못되어도 현재 비밀번호 에러부터 반환한다", () => {
    const errors = validatePasswordForm({
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    });

    expect(errors).toEqual({
      ...NO_ERROR,
      currentPassword: "현재 비밀번호를 입력해주세요.",
    });
  });
});

describe("hasValidationError", () => {
  it("모든 에러 메시지가 비어 있으면 false를 반환한다", () => {
    expect(hasValidationError(NO_ERROR)).toBe(false);
  });

  it("에러 메시지가 하나라도 있으면 true를 반환한다", () => {
    expect(
      hasValidationError({
        ...NO_ERROR,
        newPassword: "새 비밀번호를 입력해주세요.",
      }),
    ).toBe(true);
  });
});
