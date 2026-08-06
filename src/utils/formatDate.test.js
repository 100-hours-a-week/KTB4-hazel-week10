import { describe, expect, it } from "vitest";

import { formatDate } from "./formatDate.js";

describe("formatDate", () => {
  it("ISO 날짜의 소수 초를 제거하고 날짜와 시간 사이를 공백으로 바꾼다", () => {
    const result = formatDate("2026-08-06T19:30:45.123Z");

    expect(result).toBe("2026-08-06 19:30:45");
  });

  it("소수 초가 없는 ISO 날짜도 날짜와 시간 사이를 공백으로 바꾼다", () => {
    const result = formatDate("2026-08-06T19:30:45");

    expect(result).toBe("2026-08-06 19:30:45");
  });
});
