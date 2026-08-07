import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "./index.jsx";

describe("Modal", () => {
  it("닫혀 있으면 dialog를 렌더링하지 않는다", () => {
    render(<Modal isOpen={false} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("열려 있으면 제목과 설명을 표시한다", () => {
    render(
      <Modal
        isOpen
        title="삭제하시겠습니까?"
        description="삭제한 내용은 복구할 수 없습니다."
      />,
    );

    const dialog = screen.getByRole("dialog", {
      name: "삭제하시겠습니까?",
    });

    expect(dialog).toHaveTextContent("삭제한 내용은 복구할 수 없습니다.");
  });

  it("취소와 확인 버튼을 클릭하면 각각의 callback을 호출한다", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onConfirm = vi.fn();

    render(
      <Modal
        isOpen
        cancelText="취소하기"
        confirmText="삭제하기"
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    );

    await user.click(screen.getByRole("button", { name: "취소하기" }));
    await user.click(screen.getByRole("button", { name: "삭제하기" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
