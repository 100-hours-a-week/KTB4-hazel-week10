import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Header from "../../components/header/index.jsx";
import { getBoardDetailRequest, updateBoardRequest } from "../../api/boardApi.js";
import useBooleanState from "../../utils/isBooleanState.js";
import ImagePreviewList from "./components/ImagePreviewList.jsx";
import { INITIAL_ERRORS, INITIAL_FORM } from "./initialState.js";
import { createBoardFormData, getImageFileText, hasValidationError, normalizeEditForm, validateEditForm } from "./boardEditUtils.js";
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
  const [loadedPostId, setLoadedPostId] = useState(null);
  const [loadErrorMessage, setLoadErrorMessage] = useState("");

  const { value: isSubmitting, setTrue: startSubmitting, setFalse: finishSubmitting } = useBooleanState(false);

  const isLoading = isValidPostId && loadedPostId !== postId;
  const imageFileText = getImageFileText(currentImages, newImages);

  useEffect(() => {
    document.title = "게시글 수정";
  }, []);

  useEffect(() => {
    if (!isValidPostId) {
      return undefined;
    }

    let isCancelled = false;

    getBoardDetailRequest(postId)
      .then(({ data }) => {
        if (isCancelled) {
          return;
        }

        setForm({
          title: data.title ?? "",
          content: data.text ?? "",
        });
        setCurrentImages(data.images ?? []);
        setNewImages([]);
        setErrors(INITIAL_ERRORS);
        setLoadErrorMessage("");
        setLoadedPostId(postId);
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }

        console.error("게시글 조회 실패:", error);
        setLoadErrorMessage(
          error.message || "게시글을 불러오지 못했습니다.",
        );
        setLoadedPostId(postId);
      });

    return () => {
      isCancelled = true;
    };
  }, [postId, isValidPostId]);

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

    setCurrentImages([]);
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
      startSubmitting();

      await updateBoardRequest(postId, formData);
      navigate(getBoardDetailPath(postId));
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      window.alert(error.message || "게시글 수정에 실패했습니다.");
    } finally {
      finishSubmitting();
    }
  };

  return (
    <>
      <Header type="withBackAndProfile" />

      <main className="edit">
        <h2 className="title">게시글 수정</h2>

        {!isValidPostId && (
          <p className="edit__error">올바르지 않은 게시글 번호입니다.</p>
        )}

        {isLoading && (
          <p className="edit__loading">게시글을 불러오는 중입니다.</p>
        )}

        {!isLoading && loadErrorMessage && (
          <p className="edit__error">{loadErrorMessage}</p>
        )}

        {!isLoading && !loadErrorMessage && isValidPostId && (
          <form className="edit-form" onSubmit={handleSubmit} noValidate>
            <div className="form-container">
              <div className="form__item">
                <label className="form__label" htmlFor="title">제목*</label>

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
                <label className="form__label" htmlFor="content">내용*</label>

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
