export default function Modal({
  id = "modal",
  isOpen = false,
  title = "",
  description = "",
  cancelText = "취소",
  confirmText = "확인",
  onCancel,
  onConfirm,
}) {
  if (!isOpen) return null;

  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <div id={id} className="modal is-active">
      <div
        className="modal__overlay"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        className="modal__content"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <h2 id={titleId} className="modal__title">
          {title}
        </h2>

        <p id={descriptionId} className="modal__description">
          {description}
        </p>

        <div className="modal__button-container">
          <button
            className="modal__button modal__button--cancel"
            type="button"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className="modal__button modal__button--confirm"
            type="button"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}