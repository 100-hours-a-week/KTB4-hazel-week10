import { describe, expect, it } from "vitest";

import { getCategoryLabel } from "./categories.js";

describe("getCategoryLabel", () => {
  it("FRONTEND 카테고리를 FE로 변환한다", () => {
    expect(getCategoryLabel("FRONTEND")).toBe("FE");
  });

  it("BACKEND 카테고리를 BE로 변환한다", () => {
    expect(getCategoryLabel("BACKEND")).toBe("BE");
  });

  it("CS 카테고리는 CS로 반환한다", () => {
    expect(getCategoryLabel("CS")).toBe("CS");
  });

  it("등록되지 않은 카테고리는 입력값을 그대로 반환한다", () => {
    expect(getCategoryLabel("UNKNOWN")).toBe("UNKNOWN");
  });
});
