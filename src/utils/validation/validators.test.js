import { describe, expect, it } from "vitest";
import { isValidEmail, isValidPassword } from "./validators";

describe("isValidEmail", () => {
  describe("유효한 이메일", () => {
    it("아이디@도메인.최상위도메인 형식이면 true를 반환한다", () => {
      expect(isValidEmail("user@example.com")).toBe(true);
    });

    it("서브도메인이 여러 단계여도 true를 반환한다", () => {
      expect(isValidEmail("user@mail.example.co.kr")).toBe(true);
    });

    it("아이디에 점, 하이픈, 플러스 태그가 있어도 true를 반환한다", () => {
      expect(isValidEmail("hazel.kim+week10@example.com")).toBe(true);
      expect(isValidEmail("hazel-kim@example.com")).toBe(true);
      expect(isValidEmail("hazel_kim@example.com")).toBe(true);
    });

    it("한 글자짜리 아이디와 도메인도 형식만 맞으면 true를 반환한다", () => {
      expect(isValidEmail("a@b.c")).toBe(true);
    });
  });

  describe("골뱅이(@) 규칙 위반", () => {
    it("골뱅이가 없으면 false를 반환한다", () => {
      expect(isValidEmail("userexample.com")).toBe(false);
    });

    it("골뱅이가 2개 이상이면 false를 반환한다", () => {
      expect(isValidEmail("user@@example.com")).toBe(false);
      expect(isValidEmail("user@sub@example.com")).toBe(false);
    });

    it("골뱅이 앞의 아이디가 비어 있으면 false를 반환한다", () => {
      expect(isValidEmail("@example.com")).toBe(false);
    });

    it("골뱅이 뒤의 도메인이 비어 있으면 false를 반환한다", () => {
      expect(isValidEmail("user@")).toBe(false);
    });
  });

  describe("도메인 규칙 위반", () => {
    it("도메인에 점이 없으면 false를 반환한다", () => {
      expect(isValidEmail("user@example")).toBe(false);
    });

    it("점으로 시작하거나 끝나는 도메인이면 false를 반환한다", () => {
      expect(isValidEmail("user@.com")).toBe(false);
      expect(isValidEmail("user@example.")).toBe(false);
    });
  });

  describe("공백과 빈 값", () => {
    it("문자열 중간에 공백이 있으면 false를 반환한다", () => {
      expect(isValidEmail("user @example.com")).toBe(false);
      expect(isValidEmail("user@ example.com")).toBe(false);
      expect(isValidEmail("us er@example.com")).toBe(false);
    });

    it("앞뒤에 공백이 붙어 있으면 false를 반환한다", () => {
      expect(isValidEmail(" user@example.com")).toBe(false);
      expect(isValidEmail("user@example.com ")).toBe(false);
    });

    it("빈 문자열이나 공백만 있으면 false를 반환한다", () => {
      expect(isValidEmail("")).toBe(false);
      expect(isValidEmail("   ")).toBe(false);
    });
  });

  describe("문자열이 아닌 값", () => {
    it("null, undefined가 들어와도 예외 없이 false를 반환한다", () => {
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
    });

    it("숫자나 객체가 들어와도 예외 없이 false를 반환한다", () => {
      expect(isValidEmail(1234)).toBe(false);
      expect(isValidEmail({})).toBe(false);
      expect(isValidEmail([])).toBe(false);
    });
  });
});

describe("isValidPassword", () => {
  describe("유효한 비밀번호", () => {
    it("대문자·소문자·숫자·특수문자를 모두 포함하고 8~20자면 true를 반환한다", () => {
      expect(isValidPassword("Password1!")).toBe(true);
    });

    it("특수문자는 종류를 가리지 않고 인정한다", () => {
      expect(isValidPassword("Password1@")).toBe(true);
      expect(isValidPassword("Password1#")).toBe(true);
      expect(isValidPassword("Password1-")).toBe(true);
      expect(isValidPassword("Password1한")).toBe(true);
    });
  });

  describe("문자 구성 조건", () => {
    it("대문자가 없으면 false를 반환한다", () => {
      expect(isValidPassword("password1!")).toBe(false);
    });

    it("소문자가 없으면 false를 반환한다", () => {
      expect(isValidPassword("PASSWORD1!")).toBe(false);
    });

    it("숫자가 없으면 false를 반환한다", () => {
      expect(isValidPassword("Password!")).toBe(false);
    });

    it("특수문자가 없으면 false를 반환한다", () => {
      expect(isValidPassword("Password1")).toBe(false);
    });

    it("영문 없이 숫자와 특수문자만 있으면 false를 반환한다", () => {
      expect(isValidPassword("12345678!@")).toBe(false);
    });
  });

  describe("길이 조건 (8자 이상 20자 이하)", () => {
    it("8자 미만이면 false를 반환한다", () => {
      expect(isValidPassword("Abc1!de")).toBe(false); // 7자
      expect(isValidPassword("Pass1!")).toBe(false); // 6자
    });

    it("경계값인 8자면 true를 반환한다", () => {
      expect(isValidPassword("Abcd1!ef")).toBe(true); // 8자
    });

    it("경계값인 20자면 true를 반환한다", () => {
      expect(isValidPassword("Abcdefghij1234567!zz")).toBe(true); // 20자
    });

    it("20자를 초과하면 false를 반환한다", () => {
      expect(isValidPassword("Abcdefghij1234567!zzz")).toBe(false); // 21자
    });

    it("빈 문자열이면 false를 반환한다", () => {
      expect(isValidPassword("")).toBe(false);
    });
  });

  describe("문자열이 아닌 값", () => {
    it("null, undefined가 들어와도 예외 없이 false를 반환한다", () => {
      expect(isValidPassword(null)).toBe(false);
      expect(isValidPassword(undefined)).toBe(false);
    });

    it("숫자나 객체가 들어와도 예외 없이 false를 반환한다", () => {
      expect(isValidPassword(12345678)).toBe(false);
      expect(isValidPassword({})).toBe(false);
    });
  });
});
