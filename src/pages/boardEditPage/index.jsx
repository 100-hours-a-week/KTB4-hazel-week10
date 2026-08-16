import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "../../components/header/index.jsx";
import boardQueries from "@/queryFactory/boardQueries.js";
import { useUpdateBoard } from "@/hooks/useBoardMutations.js";
import ImagePreviewList from "./components/ImagePreviewList.jsx";
import { INITIAL_ERRORS, INITIAL_FORM } from "./initialState.js";
import { createBoardFormData, getImageFileText, hasValidationError, normalizeEditForm, validateEditForm } from "./boardEditUtils.js";
import CategorySelect from "../../components/categorySelect/index.jsx";
import FormSkeleton from "../../components/skeleton/FormSkeleton.jsx";
import "./index.css";

function getBoardDetailPath(postId) {
  return `/boards/${postId}`;
}

function BoardEditPage() {
  const navigate = useNavigate();
  const { postId: pathPostId } = useParams();
  const [searchParams] = useSearchParams();

  const postId = Number(pathPostId ?? searchParams.get("id"));
  const isValidPostId = Number.isInteger(postId) && postId > 0;

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [currentImages, setCurrentImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const boardDetailQuery = useQuery(boardQueries.detail(postId));
  const updateBoardMutation = useUpdateBoard();
  const isSubmitting = updateBoardMutation.isPending;
  const isLoading = isValidPostId && boardDetailQuery.isPending;
  const loadErrorMessage = boardDetailQuery.error?.message || "";
  const imageFileText = getImageFileText(currentImages, newImages);

  useEffect(() => {
    document.title = "질문 수정";
  }, []);

  useEffect(() => {
    const data = boardDetailQuery.data?.data;

    if (!data) {
      return;
    }

    setForm({
      title: data.title ?? "",
      category: data.category ?? "",
      content: data.text ?? "",
    });
    setCurrentImages(data.images ?? []);
    setNewImages([]);
    setErrors(INITIAL_ERRORS);
  }, [boardDetailQuery.data]);
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
    const selectedFiles = Array.from(event.target.files ?? []);

    if (!selectedFiles.length) {
      return;
    }

    setNewImages((prev) => [...prev, ...selectedFiles]);
    event.target.value = "";
  };

  const handleDeleteCurrentImage = (imageIndex) => {
    setCurrentImages((prev) =>
      prev.filter((_, index) => index !== imageIndex),
    );
  };

  const handleDeleteNewImage = (imageIndex) => {
    setNewImages((prev) =>
      prev.filter((_, index) => index !== imageIndex),
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const normalizedForm = normalizeEditForm(form);
    const nextErrors = validateEditForm(normalizedForm);

    setErrors(nextErrors);

    if (hasValidationError(nextErrors)) {
      return;
    }

    const formData = createBoardFormData({
      form: normalizedForm,
      currentImages,
      newImages,
    });

    try {
      await updateBoardMutation.mutateAsync({
        boardId: postId,
        data: formData,
      });
      navigate(getBoardDetailPath(postId));
    } catch (error) {
      console.error("질문 수정 실패:", error);
      window.alert(error.message || "질문 수정에 실패했습니다.");
    }
  };

  return (
    <>
      <Header type="withBackAndProfile" />

      <main className="edit">
        <h2 className="title">질문 수정</h2>

        {!isValidPostId && (
          <p className="edit__error">올바르지 않은 질문 번호입니다.</p>
        )}

        {isLoading && (
          <div className="edit-form">
            <FormSkeleton
              fieldHeights={[66, 66, 282, 40]}
              gap={21}
              label="질문을 불러오는 중입니다."
            />
          </div>
        )}

        {!isLoading && loadErrorMessage && (
          <p className="edit__error">{loadErrorMessage}</p>
        )}

        {!isLoading && !loadErrorMessage && isValidPostId && (
          <form className="edit-form" onSubmit={handleSubmit} noValidate>
            <div className="form-container">
              <div className="form__item">
                <label className="form__label" htmlFor="title">질문*</label>

                <input
                  id="title"
                  name="title"
                  className="form__input"
                  type="text"
                  maxLength={26}
                  value={form.title}
                  aria-describedby="titleHelper"
                  aria-invalid={Boolean(errors.title)}
                  onChange={handleInputChange}
                />

                <p id="titleHelper" className="form__helper">{errors.title && `* ${errors.title}`}</p>
              </div>

              <div className="form__item">
                <label className="form__label" htmlFor="category">카테고리*</label>

                <CategorySelect
                  id="category"
                  name="category"
                  value={form.category}
                  hasError={Boolean(errors.category)}
                  onChange={handleInputChange}
                />

                <p id="categoryHelper" className="form__helper">{errors.category && `* ${errors.category}`}</p>
              </div>

              <div className="form__item">
                <label className="form__label" htmlFor="content">설명*</label>

                <textarea
                  id="content"
                  name="content"
                  className="form__textarea"
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
                  <span className="file-field__name">{imageFileText}</span>
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

                <ImagePreviewList
                  currentImages={currentImages}
                  newImages={newImages}
                  onDeleteCurrentImage={handleDeleteCurrentImage}
                  onDeleteNewImage={handleDeleteNewImage}
                />
              </div>
            </div>

            <button
              className="button edit__button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "수정 중..." : "수정하기"}
            </button>
          </form>
        )}
      </main>
    </>
  );
}

export default BoardEditPage;
