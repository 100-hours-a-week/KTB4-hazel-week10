import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Skeleton, { SkeletonGroup } from "./index.jsx";

describe("SkeletonGroup", () => {
  it("로딩 상태를 전달한 라벨로 안내한다", () => {
    // Given & When
    render(
      <SkeletonGroup label="질문 목록을 불러오는 중입니다.">
        <Skeleton />
      </SkeletonGroup>,
    );

    // Then
    const status = screen.getByRole("status", { name: "질문 목록을 불러오는 중입니다." });

    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute("aria-busy", "true");
  });

  it("내용이 없는 자리표시자는 보조 기기에 노출하지 않는다", () => {
    // Given & When
    const { container } = render(
      <SkeletonGroup label="불러오는 중입니다.">
        <Skeleton width={80} height={16} />
      </SkeletonGroup>,
    );

    // Then
    expect(container.querySelector(".skeleton")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Skeleton", () => {
  it("width와 height를 지정하면 해당 크기로 그린다", () => {
    // Given & When
    const { container } = render(<Skeleton width={120} height={24} />);

    // Then
    expect(container.querySelector(".skeleton")).toHaveStyle({
      width: "120px",
      height: "24px",
    });
  });

  it("circle을 지정하면 원형으로 그린다", () => {
    // Given & When
    const { container } = render(<Skeleton width={40} height={40} circle />);

    // Then
    const skeleton = container.querySelector(".skeleton");

    expect(skeleton).toHaveClass("skeleton--circle");
    expect(skeleton).toHaveStyle({ borderRadius: "50%" });
  });
});
