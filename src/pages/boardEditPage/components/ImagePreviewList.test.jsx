/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImagePreviewList from "./ImagePreviewList.jsx";

describe("ImagePreviewList", () => {
  it("현재 이미지와 새로 선택한 파일의 이름을 표시한다", () => {
    const newImage = new File(["image"], "new-image.png", {
      type: "image/png",
      lastModified: 1,
    });

    render(
      <ImagePreviewList
        currentImages={["/images/current.png"]}
        newImages={[newImage]}
        onDeleteCurrentImage={vi.fn()}
        onDeleteNewImage={vi.fn()}
      />,
    );

    expect(screen.getByText("/images/current.png")).toBeInTheDocument();
    expect(screen.getByText("new-image.png")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "삭제" })).toHaveLength(2);
  });

  it("현재 이미지와 새 파일의 삭제 버튼이 각각의 인덱스를 전달한다", async () => {
    const user = userEvent.setup();
    const newImage = new File(["image"], "new-image.png", {
      type: "image/png",
      lastModified: 1,
    });
    const onDeleteCurrentImage = vi.fn();
    const onDeleteNewImage = vi.fn();

    render(
      <ImagePreviewList
        currentImages={["/images/current.png"]}
        newImages={[newImage]}
        onDeleteCurrentImage={onDeleteCurrentImage}
        onDeleteNewImage={onDeleteNewImage}
      />,
    );

    const deleteButtons = screen.getAllByRole("button", { name: "삭제" });
    await user.click(deleteButtons[0]);
    await user.click(deleteButtons[1]);

    expect(onDeleteCurrentImage).toHaveBeenCalledWith(0);
    expect(onDeleteNewImage).toHaveBeenCalledWith(0);
  });

  it("표시할 이미지가 없으면 미리보기 목록을 렌더링하지 않는다", () => {
    render(
      <ImagePreviewList
        currentImages={[]}
        newImages={[]}
        onDeleteCurrentImage={vi.fn()}
        onDeleteNewImage={vi.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: "삭제" })).not.toBeInTheDocument();
  });
});
