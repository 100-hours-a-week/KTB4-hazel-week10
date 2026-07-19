import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/index.jsx";
import { createBoardRequest } from "../../api/boardApi.js";
import useBooleanState from "../../utils/useBooleanState.js";
import { INITIAL_ERRORS, INITIAL_FORM } from "./initialState.js";
import { createBoardFormData, hasValidationError, normalizeBoardForm, validateBoardForm } from "./boardWriteUtils.js";
import "./index.css";

const BOARD_LIST_PATH = "/boards";

function BoardWritePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [selectedImages, setSelectedImages] = useState([]);
  const { value: isSubmitting, setTrue: startSubmitting, setFalse: finishSubmitting } = useBooleanState(false);

  const handleInputChange = ({ target: { name, value } }) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    setSelectedImages((prev) => [...prev, ...files]);
    event.target.value = "";
  };

  const handleDeleteImage = (targetIndex) => {
    setSelectedImages((prev) => prev.filter((_, index) => index !== targetIndex));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const normalizedForm = normalizeBoardForm(form);
    const nextErrors = validateBoardForm(normalizedForm);

    setErrors(nextErrors);

    if (hasValidationError(nextErrors)) {
      return;
    }

    const formData = createBoardFormData(normalizedForm, selectedImages);

    try {
      startSubmitting();

      const response = await createBoardRequest(formData);
      const boardId = response?.data?.id;

      navigate(boardId ? `/boards/${boardId}` : BOARD_LIST_PATH);
    } catch (error) {
      console.error("게시글 작성 실패:", error);

      setErrors((prev) => ({
        ...prev,
        content: error.message || "게시글 작성에 실패했습니다.",
      }));
    } finally {
      finishSubmitting();
    }
  };

  return (
    <>
      <Header type="withBackAndProfile" />

      <main className="write">
        <h2 className="title">게시글 작성</h2>

        <form className="write-form" onSubmit={handleSubmit} noValidate>
          <div className="form-container">
            <div className="form__item">
              <label className="form__label" htmlFor="title">제목*</label>

              <input
                id="title"
                name="title"
                className="form__input"
                type="text"
                placeholder="제목을 입력해주세요. (최대 26글자)"
                maxLength={26}
                value={form.title}
                aria-describedby="titleHelper"
                aria-invalid={Boolean(errors.title)}
                onChange={handleInputChange}
              />

              <p id="titleHelper" className="form__helper">{errors.title && `* ${errors.title}`}</p>
            </div>

            <div className="form__item">
              <label className="form__label" htmlFor="content">내용*</label>

              <textarea
                id="content"
                name="content"
                className="form__textarea"
                placeholder="내용을 입력해주세요."
                value={form.content}
                aria-describedby="contentHelper"
                aria-invalid={Boolean(errors.content)}
                onChange={handleInputChange}
              />

              <p id="contentHelper" className="form__helper">{errors.content && `* ${errors.content}`}</p>
            </div>

            <div className="form__item">
              <label className="form__label" htmlFor="image">이미지</label>

              <div className="file-field">
                <label className="file-field__button" htmlFor="image">파일 선택</label>
                <span className="file-field__name">
                  {selectedImages.length
                    ? `${selectedImages.length}개의 이미지 선택됨`
                    : "파일을 선택해주세요."}
                </span>
              </div>

              <input
                id="image"
                name="image"
                className="file-field__input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />

              <div className="image-preview-list">
                {selectedImages.map((file, index) => (
                  <div
                    key={`${file.name}-${file.lastModified}-${index}`}
                    className="image-preview"
                  >
                    <span className="image-preview__text">{file.name}</span>

                    <button
                      className="image-preview__delete-button"
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            className="button write__button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "작성 중..." : "완료"}
          </button>
        </form>
      </main>
    </>
  );
}

export default BoardWritePage;
