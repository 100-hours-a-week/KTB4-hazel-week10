import { createBoardFormData, getImageFileText, hasValidationError, normalizeEditForm, validateEditForm } from "./boardEditUtils.js";

const VALID_FORM = {
  title: "기존 질문",
  category: "BACKEND",
  content: "기존 설명",
};

const NO_ERROR = {
  title: "",
  category: "",
  content: "",
};

const NEW_IMAGE = new File(["new-image"], "new.png", { type: "image/png" });

describe("normalizeEditForm", () => {
  it("제목과 내용을 trim하고 카테고리는 유지한다", () => {
    expect(
      normalizeEditForm({
        title: "  기존 질문  ",
        category: "BACKEND",
        content: "  기존 설명  ",
      }),
    ).toEqual(VALID_FORM);
  });
});

describe("validateEditForm", () => {
  it("모든 입력이 유효하면 빈 에러 객체를 반환한다", () => {
    expect(validateEditForm(VALID_FORM)).toEqual(NO_ERROR);
  });

  it.each([
    ["title", "제목을 입력해주세요."],
    ["category", "카테고리를 선택해주세요."],
    ["content", "내용을 입력해주세요."],
  ])("%s가 비어 있으면 해당 에러를 반환한다", (field, message) => {
    expect(validateEditForm({ ...VALID_FORM, [field]: "" })).toEqual({
      ...NO_ERROR,
      [field]: message,
    });
  });

  it("여러 입력이 잘못되어도 제목 에러부터 반환한다", () => {
    expect(
      validateEditForm({ title: "", category: "", content: "" }),
    ).toEqual({
      ...NO_ERROR,
      title: "제목을 입력해주세요.",
    });
  });
});

describe("hasValidationError", () => {
  it("에러 객체가 비어 있으면 false를 반환한다", () => {
    expect(hasValidationError(NO_ERROR)).toBe(false);
  });

  it("에러 메시지가 있으면 true를 반환한다", () => {
    expect(
      hasValidationError({ ...NO_ERROR, category: "카테고리를 선택해주세요." }),
    ).toBe(true);
  });
});

describe("createBoardFormData", () => {
  it("폼 값과 새 이미지와 유지할 이미지 경로를 FormData에 담는다", () => {
    const formData = createBoardFormData({
      form: VALID_FORM,
      currentImages: ["/images/old.png", "/images/older.png"],
      newImages: [NEW_IMAGE],
    });

    expect(formData.get("title")).toBe(VALID_FORM.title);
    expect(formData.get("category")).toBe(VALID_FORM.category);
    expect(formData.get("text")).toBe(VALID_FORM.content);
    expect(formData.getAll("images")).toEqual([NEW_IMAGE]);
    expect(formData.getAll("remainImages")).toEqual([
      "/images/old.png",
      "/images/older.png",
    ]);
  });
});

describe("getImageFileText", () => {
  it("새 이미지가 있으면 새 이미지 개수를 표시한다", () => {
    expect(getImageFileText(["/images/old.png"], [NEW_IMAGE])).toBe(
      "1개의 새 이미지 선택됨",
    );
  });

  it("새 이미지가 없고 기존 이미지가 있으면 기존 이미지 개수를 표시한다", () => {
    expect(getImageFileText(["/images/old.png", "/images/older.png"], [])).toBe(
      "2개의 기존 이미지",
    );
  });

  it("이미지가 없으면 파일 선택 안내를 표시한다", () => {
    expect(getImageFileText([], [])).toBe("파일을 선택해주세요.");
  });
});
