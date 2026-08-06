import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import useBooleanState from "./useBooleanState.js";

describe("useBooleanState", () => {
  it("초기값을 boolean으로 변환해 value에 반영한다", () => {
    const { result } = renderHook(() => useBooleanState(1));

    expect(result.current.value).toBe(true);
  });

  it("setTrue를 호출하면 value를 true로 바꾼다", () => {
    const { result } = renderHook(() => useBooleanState(false));

    act(() => {
      result.current.setTrue();
    });

    expect(result.current.value).toBe(true);
  });

  it("setFalse를 호출하면 value를 false로 바꾼다", () => {
    const { result } = renderHook(() => useBooleanState(true));

    act(() => {
      result.current.setFalse();
    });

    expect(result.current.value).toBe(false);
  });

  it("toggle을 호출할 때마다 value를 반전한다", () => {
    const { result } = renderHook(() => useBooleanState(false));

    act(() => {
      result.current.toggle();
    });
    expect(result.current.value).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.value).toBe(false);
  });

  it("반환된 setValue로 원하는 boolean 값을 직접 설정할 수 있다", () => {
    const { result } = renderHook(() => useBooleanState(false));

    act(() => {
      result.current.setValue(true);
    });

    expect(result.current.value).toBe(true);
  });
});
