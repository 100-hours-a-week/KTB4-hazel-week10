import { afterAll, describe, expect, it, vi } from "vitest";

const TEST_BASE_URL = "https://test-api.example.com";

vi.stubEnv("VITE_API_BASE_URL", TEST_BASE_URL);

const { resolveImageUrl } = await import("./resolveImageUrl.js");

afterAll(() => {
  vi.unstubAllEnvs();
});

describe("resolveImageUrl", () => {
  it("경로가 없으면 빈 문자열을 반환한다", () => {
    expect(resolveImageUrl("")).toBe("");
    expect(resolveImageUrl(null)).toBe("");
    expect(resolveImageUrl(undefined)).toBe("");
  });

  it("외부 URL은 원본 그대로 반환한다", () => {
    expect(resolveImageUrl("https://cdn.example.com/image.png")).toBe(
      "https://cdn.example.com/image.png",
    );
    expect(resolveImageUrl("http://cdn.example.com/image.png")).toBe(
      "http://cdn.example.com/image.png",
    );
  });

  it("blob URL과 data URL은 원본 그대로 반환한다", () => {
    expect(resolveImageUrl("blob:http://localhost/image-id")).toBe(
      "blob:http://localhost/image-id",
    );
    expect(resolveImageUrl("data:image/png;base64,abc")).toBe(
      "data:image/png;base64,abc",
    );
  });

  it("슬래시로 시작하는 경로에는 API base URL을 중복 슬래시 없이 결합한다", () => {
    expect(resolveImageUrl("/images/profile.png")).toBe(
      `${TEST_BASE_URL}/images/profile.png`,
    );
  });

  it("슬래시 없이 시작하는 경로에도 API base URL과 구분자를 결합한다", () => {
    expect(resolveImageUrl("images/profile.png")).toBe(
      `${TEST_BASE_URL}/images/profile.png`,
    );
  });
});
