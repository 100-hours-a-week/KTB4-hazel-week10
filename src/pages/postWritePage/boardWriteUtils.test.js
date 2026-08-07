import {
  createBoardFormData,
  hasValidationError,
  normalizeBoardForm,
  validateBoardForm,
} from "./boardWriteUtils.js";

const VALID_FORM = {
  title: "React 질문",
  category: "FRONTEND",
  content: "React에 대해 설명해주세요.",
};

const NO_ERROR = {
  title: "",
  category: "",
  content: "",
};

const IMAGE_1 = new File(["image-1"], "first.png", { type: "image/png" });
const IMAGE_2 = new File(["image-2"], "second.png", { type: "image/png" });

describe("normalizeBoardForm", () => {
  it("제목과 내용을 trim하고 카테고리는 유지한다", () => {
    const result = normalizeBoardForm({
      title: "  React 질문  ",
      category: "FRONTEND",
      content: "  React에 대해 설명해주세요.  ",
    });

    expect(result).toEqual(VALID_FORM);
  });

  it("원본 폼 객체를 변경하지 않는다", () => {
    const form = {
      title: "  React 질문  ",
      category: "FRONTEND",
      content: "  설명  ",
    };

    normalizeBoardForm(form);

    expect(form.title).toBe("  React 질문  ");
    expect(form.content).toBe("  설명  ");
  });
});

describe("validateBoardForm", () => {
  it("모든 입력이 유효하면 빈 에러 객체를 반환한다", () => {
    expect(validateBoardForm(VALID_FORM)).toEqual(NO_ERROR);
  });

  it("제목이 비어 있으면 제목 에러를 반환한다", () => {
    expect(validateBoardForm({ ...VALID_FORM, title: "" })).toEqual({
      ...NO_ERROR,
      title: "제목을 입력해주세요.",
    });
  });

  it("카테고리가 비어 있으면 카테고리 에러를 반환한다", () => {
    expect(validateBoardForm({ ...VALID_FORM, category: "" })).toEqual({
      ...NO_ERROR,
      category: "카테고리를 선택해주세요.",
    });
  });

  it("내용이 비어 있으면 내용 에러를 반환한다", () => {
    expect(validateBoardForm({ ...VALID_FORM, content: "" })).toEqual({
      ...NO_ERROR,
      content: "내용을 입력해주세요.",
    });
  });

  it("여러 입력이 잘못되어도 제목 에러부터 반환한다", () => {
    expect(
      validateBoardForm({ title: "", category: "", content: "" }),
    ).toEqual({
      ...NO_ERROR,
      title: "제목을 입력해주세요.",
    });
  });
});

describe("hasValidationError", () => {
  it("에러가 없으면 false를 반환한다", () => {
    expect(hasValidationError(NO_ERROR)).toBe(false);
  });

  it("에러가 있으면 true를 반환한다", () => {
    expect(
      hasValidationError({ ...NO_ERROR, content: "내용을 입력해주세요." }),
    ).toBe(true);
  });
});

describe("createBoardFormData", () => {
  it("폼 값과 선택한 이미지들을 FormData에 담는다", () => {
    const formData = createBoardFormData(VALID_FORM, [IMAGE_1, IMAGE_2]);

    expect(formData.get("title")).toBe(VALID_FORM.title);
    expect(formData.get("category")).toBe(VALID_FORM.category);
    expect(formData.get("text")).toBe(VALID_FORM.content);
    expect(formData.getAll("images")).toEqual([IMAGE_1, IMAGE_2]);
  });

  it("이미지가 없으면 images 항목을 만들지 않는다", () => {
    const formData = createBoardFormData(VALID_FORM, []);

    expect(formData.get("images")).toBeNull();
  });
});
