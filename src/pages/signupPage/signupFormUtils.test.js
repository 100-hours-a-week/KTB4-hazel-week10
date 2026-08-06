import { describe, expect, it } from "vitest";
import {
  createSignupFormData,
  hasValidationError,
  normalizeSignupForm,
  validateSignupForm,
} from "./signupFormUtils";
import { INITIAL_ERRORS } from "./initialState";

const VALID_FORM = {
  email: "hazel@example.com",
  password: "Password1!",
  passwordConfirm: "Password1!",
  nickname: "hazel",
};

const PROFILE_IMAGE = new File(["dummy"], "profile.png", {
  type: "image/png",
});

const NO_ERROR = INITIAL_ERRORS;

const EMAIL_REQUIRED = "이메일을 입력해주세요.";
const EMAIL_FORMAT = "이메일 주소 형식을 입력해주세요.";
const PASSWORD_REQUIRED = "비밀번호를 입력해주세요.";
const PASSWORD_FORMAT = "비밀번호는 8자 이상 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
const PASSWORD_CONFIRM_REQUIRED = "비밀번호를 한번 더 입력해주세요.";
const PASSWORD_MISMATCH = "비밀번호가 다릅니다.";
const NICKNAME_REQUIRED = "닉네임을 입력해주세요.";
const PROFILE_IMAGE_REQUIRED = "프로필 사진을 추가해주세요.";

describe("normalizeSignupForm", () => {
  it("모든 입력값의 앞뒤 공백을 제거한다", () => {
    const result = normalizeSignupForm({
      email: "  hazel@example.com  ",
      password: " Password1! ",
      passwordConfirm: " Password1! ",
      nickname: "  hazel  ",
    });

    expect(result).toEqual({
      email: "hazel@example.com",
      password: "Password1!",
      passwordConfirm: "Password1!",
      nickname: "hazel",
    });
  });

  it("공백만 입력한 값은 빈 문자열이 되어 미입력으로 취급된다", () => {
    const result = normalizeSignupForm({
      email: "   ",
      password: "   ",
      passwordConfirm: "   ",
      nickname: "   ",
    });

    expect(result).toEqual({
      email: "",
      password: "",
      passwordConfirm: "",
      nickname: "",
    });
  });

  it("값 중간의 공백은 유지한다", () => {
    const result = normalizeSignupForm({
      ...VALID_FORM,
      nickname: "  하 젤  ",
    });

    expect(result.nickname).toBe("하 젤");
  });

  it("원본 폼 객체를 변경하지 않는다", () => {
    const form = {
      email: "  hazel@example.com  ",
      password: " Password1! ",
      passwordConfirm: " Password1! ",
      nickname: "  hazel  ",
    };

    normalizeSignupForm(form);

    expect(form.email).toBe("  hazel@example.com  ");
    expect(form.nickname).toBe("  hazel  ");
  });
});

describe("validateSignupForm", () => {
  describe("모든 입력이 유효한 경우", () => {
    it("에러 메시지가 하나도 없는 결과를 반환한다", () => {
      const errors = validateSignupForm(VALID_FORM, PROFILE_IMAGE);

      expect(errors).toEqual(NO_ERROR);
    });
  });

  describe("이메일 검증", () => {
    it("이메일이 비어 있으면 입력을 요구하는 메시지를 반환한다", () => {
      const errors = validateSignupForm({ ...VALID_FORM, email: "" }, PROFILE_IMAGE);

      expect(errors.email).toBe(EMAIL_REQUIRED);
    });

    it("이메일 형식이 아니면 형식을 요구하는 메시지를 반환한다", () => {
      const errors = validateSignupForm(
        { ...VALID_FORM, email: "hazel@example" },
        PROFILE_IMAGE
      );

      expect(errors.email).toBe(EMAIL_FORMAT);
    });
  });

  describe("비밀번호 검증", () => {
    it("비밀번호가 비어 있으면 입력을 요구하는 메시지를 반환한다", () => {
      const errors = validateSignupForm(
        { ...VALID_FORM, password: "", passwordConfirm: "" },
        PROFILE_IMAGE
      );

      expect(errors.password).toBe(PASSWORD_REQUIRED);
    });

    it("비밀번호가 정책에 맞지 않으면 정책을 안내하는 메시지를 반환한다", () => {
      const errors = validateSignupForm(
        { ...VALID_FORM, password: "password", passwordConfirm: "password" },
        PROFILE_IMAGE
      );

      expect(errors.password).toBe(PASSWORD_FORMAT);
    });
  });

  describe("비밀번호 확인 검증", () => {
    it("비밀번호 확인이 비어 있으면 재입력을 요구하는 메시지를 반환한다", () => {
      const errors = validateSignupForm(
        { ...VALID_FORM, passwordConfirm: "" },
        PROFILE_IMAGE
      );

      expect(errors.passwordConfirm).toBe(PASSWORD_CONFIRM_REQUIRED);
    });

    it("비밀번호와 일치하지 않으면 불일치 메시지를 반환한다", () => {
      const errors = validateSignupForm(
        { ...VALID_FORM, passwordConfirm: "Password2!" },
        PROFILE_IMAGE
      );

      expect(errors.passwordConfirm).toBe(PASSWORD_MISMATCH);
    });

    it("대소문자만 달라도 불일치로 판단한다", () => {
      const errors = validateSignupForm(
        { ...VALID_FORM, passwordConfirm: "PASSWORD1!" },
        PROFILE_IMAGE
      );

      expect(errors.passwordConfirm).toBe(PASSWORD_MISMATCH);
    });
  });

  describe("닉네임 검증", () => {
    it("닉네임이 비어 있으면 입력을 요구하는 메시지를 반환한다", () => {
      const errors = validateSignupForm({ ...VALID_FORM, nickname: "" }, PROFILE_IMAGE);

      expect(errors.nickname).toBe(NICKNAME_REQUIRED);
    });
  });

  describe("프로필 이미지 검증", () => {
    it("프로필 이미지가 없으면 추가를 요구하는 메시지를 반환한다", () => {
      const errors = validateSignupForm(VALID_FORM, null);

      expect(errors.profileImage).toBe(PROFILE_IMAGE_REQUIRED);
    });

    it("다른 입력이 모두 유효할 때만 프로필 이미지를 검사한다", () => {
      const errors = validateSignupForm({ ...VALID_FORM, nickname: "" }, null);

      expect(errors.nickname).toBe(NICKNAME_REQUIRED);
      expect(errors.profileImage).toBe("");
    });
  });

  describe("검증 우선순위", () => {
    it("여러 입력이 잘못되어도 이메일 에러만 먼저 노출한다", () => {
      const errors = validateSignupForm(
        { email: "", password: "", passwordConfirm: "", nickname: "" },
        null
      );

      expect(errors).toEqual({ ...NO_ERROR, email: EMAIL_REQUIRED });
    });

    it("이메일이 유효해지면 다음 순서인 비밀번호 에러가 노출된다", () => {
      const errors = validateSignupForm(
        { ...VALID_FORM, password: "", passwordConfirm: "", nickname: "" },
        null
      );

      expect(errors).toEqual({ ...NO_ERROR, password: PASSWORD_REQUIRED });
    });

    it("비밀번호까지 유효해지면 다음 순서인 비밀번호 확인 에러가 노출된다", () => {
      const errors = validateSignupForm(
        { ...VALID_FORM, passwordConfirm: "", nickname: "" },
        null
      );

      expect(errors).toEqual({
        ...NO_ERROR,
        passwordConfirm: PASSWORD_CONFIRM_REQUIRED,
      });
    });

    it("닉네임 차례가 되면 닉네임 에러만 노출된다", () => {
      const errors = validateSignupForm({ ...VALID_FORM, nickname: "" }, null);

      expect(errors).toEqual({ ...NO_ERROR, nickname: NICKNAME_REQUIRED });
    });

    it("마지막 순서인 프로필 이미지 에러만 남는다", () => {
      const errors = validateSignupForm(VALID_FORM, null);

      expect(errors).toEqual({ ...NO_ERROR, profileImage: PROFILE_IMAGE_REQUIRED });
    });
  });

  describe("호출 간 독립성", () => {
    it("이전 호출의 에러가 다음 호출 결과에 남지 않는다", () => {
      validateSignupForm({ ...VALID_FORM, email: "" }, null);

      const errors = validateSignupForm(VALID_FORM, PROFILE_IMAGE);

      expect(errors).toEqual(NO_ERROR);
    });

    it("반환된 에러 객체를 수정해도 초기 에러 상수는 변하지 않는다", () => {
      const errors = validateSignupForm({ ...VALID_FORM, email: "" }, PROFILE_IMAGE);

      errors.nickname = "임의로 넣은 값";

      expect(INITIAL_ERRORS.email).toBe("");
      expect(INITIAL_ERRORS.nickname).toBe("");
    });
  });
});

describe("hasValidationError", () => {
  it("모든 필드가 빈 문자열이면 false를 반환한다", () => {
    expect(hasValidationError(INITIAL_ERRORS)).toBe(false);
  });

  it("에러 메시지가 하나라도 있으면 true를 반환한다", () => {
    expect(hasValidationError({ ...INITIAL_ERRORS, email: EMAIL_REQUIRED })).toBe(true);
  });

  it("마지막 필드에만 에러가 있어도 true를 반환한다", () => {
    expect(
      hasValidationError({ ...INITIAL_ERRORS, profileImage: PROFILE_IMAGE_REQUIRED })
    ).toBe(true);
  });

  it("validateSignupForm의 결과를 그대로 판정할 수 있다", () => {
    expect(hasValidationError(validateSignupForm(VALID_FORM, PROFILE_IMAGE))).toBe(false);
    expect(hasValidationError(validateSignupForm(VALID_FORM, null))).toBe(true);
  });
});

describe("createSignupFormData", () => {
  it("서버가 요구하는 email, password, nickname, profileImage를 담는다", () => {
    const formData = createSignupFormData(VALID_FORM, PROFILE_IMAGE);

    expect(formData.get("email")).toBe(VALID_FORM.email);
    expect(formData.get("password")).toBe(VALID_FORM.password);
    expect(formData.get("nickname")).toBe(VALID_FORM.nickname);
    expect(formData.get("profileImage")).toBe(PROFILE_IMAGE);
  });

  it("확인용 입력인 passwordConfirm은 전송하지 않는다", () => {
    const formData = createSignupFormData(VALID_FORM, PROFILE_IMAGE);

    expect(formData.get("passwordConfirm")).toBeNull();
  });

  it("전송 항목은 4개뿐이다", () => {
    const formData = createSignupFormData(VALID_FORM, PROFILE_IMAGE);

    expect([...formData.keys()]).toEqual([
      "email",
      "password",
      "nickname",
      "profileImage",
    ]);
  });
});
