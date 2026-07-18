import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import Header from "../../components/header/index.jsx";

import {
  getBoardDetailRequest,
  updateBoardRequest,
} from "../../api/boardApi.js";

import "./index.css";

const INITIAL_FORM = {
  title: "",
  content: "",
};

const INITIAL_ERRORS = {
  title: "",
  content: "",
};

function getBoardDetailPath(postId) {
  return `/boards/${postId}`;
}

function normalizeEditForm(form) {
  return {
    title: form.title.trim(),
    content: form.content.trim(),
  };
}

function validateEditForm(form) {
  const errors = {
    ...INITIAL_ERRORS,
  };

  if (!form.title) {
    errors.title =
      "제목을 입력해주세요.";

    return errors;
  }

  if (!form.content) {
    errors.content =
      "내용을 입력해주세요.";
  }

  return errors;
}

function hasValidationError(errors) {
  return Object.values(errors).some(Boolean);
}

function createBoardFormData({
  form,
  currentImages,
  newImages,
}) {
  const formData = new FormData();

  formData.append("title", form.title);
  formData.append("text", form.content);

  if (newImages.length > 0) {
    newImages.forEach((image) => {
      formData.append("images", image);
    });

    return formData;
  }

  currentImages.forEach((image) => {
    formData.append("images", image);
  });

  return formData;
}

function getImageFileText(
  currentImages,
  newImages,
) {
  if (newImages.length > 0) {
    return `${newImages.length}개의 새 이미지 선택됨`;
  }

  if (currentImages.length > 0) {
    return `${currentImages.length}개의 기존 이미지`;
  }

  return "파일을 선택해주세요.";
}

function ImagePreviewList({
  currentImages,
  newImages,
  onDeleteCurrentImage,
  onDeleteNewImage,
}) {
  const hasImages =
    currentImages.length > 0 ||
    newImages.length > 0;

  if (!hasImages) {
    return null;
  }

  return (
    <div
      id="imagePreviewList"
      className="image-preview-list"
    >
      {currentImages.map(
        (imageUrl, index) => (
          <div
            key={`${imageUrl}-${index}`}
            className="image-preview"
          >
            <span className="image-preview__text">
              {imageUrl}
            </span>

            <button
              className="image-preview__delete-button"
              type="button"
              onClick={() => {
                onDeleteCurrentImage(index);
              }}
            >
              삭제
            </button>
          </div>
        ),
      )}

      {newImages.map(
        (file, index) => (
          <div
            key={`${file.name}-${file.lastModified}-${index}`}
            className="image-preview"
          >
            <span className="image-preview__text">
              {file.name}
            </span>

            <button
              className="image-preview__delete-button"
              type="button"
              onClick={() => {
                onDeleteNewImage(index);
              }}
            >
              삭제
            </button>
          </div>
        ),
      )}
    </div>
  );
}

function BoardEditPage() {
  const navigate = useNavigate();

  const { postId: pathPostId } =
    useParams();

  const [searchParams] =
    useSearchParams();

  // /boards/1/edit과 /edit?id=1을 모두 지원합니다.
  const postId = Number(
    pathPostId ??
      searchParams.get("id"),
  );

  const isValidPostId =
    Number.isInteger(postId) &&
    postId > 0;

  const [form, setForm] =
    useState(INITIAL_FORM);

  const [errors, setErrors] =
    useState(INITIAL_ERRORS);

  const [
    currentImages,
    setCurrentImages,
  ] = useState([]);

  const [newImages, setNewImages] =
    useState([]);

  const [
    loadedPostId,
    setLoadedPostId,
  ] = useState(null);

  const [
    loadErrorMessage,
    setLoadErrorMessage,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const isLoading =
    isValidPostId &&
    loadedPostId !== postId;

  const imageFileText =
    getImageFileText(
      currentImages,
      newImages,
    );

  useEffect(() => {
    document.title = "게시글 수정";
  }, []);

  useEffect(() => {
    if (!isValidPostId) {
      return undefined;
    }

    let isCancelled = false;

    getBoardDetailRequest(postId)
      .then((response) => {
        if (isCancelled) {
          return;
        }

        const post = response.data;

        setForm({
          title: post.title ?? "",
          content: post.text ?? "",
        });

        setCurrentImages(
          post.images ?? [],
        );

        setNewImages([]);
        setErrors(INITIAL_ERRORS);
        setLoadErrorMessage("");
        setLoadedPostId(postId);
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }

        console.error(
          "게시글 조회 실패:",
          error,
        );

        setLoadErrorMessage(
          error.message ||
            "게시글을 불러오지 못했습니다.",
        );

        setLoadedPostId(postId);
      });

    return () => {
      isCancelled = true;
    };
  }, [postId, isValidPostId]);

  const handleInputChange = (event) => {
    const { name, value } =
      event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const handleImageChange = (event) => {
    const selectedFiles =
      Array.from(
        event.target.files ?? [],
      );

    if (!selectedFiles.length) {
      return;
    }

    // 기존 코드와 동일하게 새 이미지를 선택하면
    // 기존 이미지는 모두 제거합니다.
    setCurrentImages([]);

    setNewImages(
      (previousImages) => [
        ...previousImages,
        ...selectedFiles,
      ],
    );

    // 같은 파일을 다시 선택할 수 있게 초기화합니다.
    event.target.value = "";
  };

  const handleDeleteCurrentImage = (
    imageIndex,
  ) => {
    setCurrentImages(
      (previousImages) => {
        return previousImages.filter(
          (_, index) =>
            index !== imageIndex,
        );
      },
    );
  };

  const handleDeleteNewImage = (
    imageIndex,
  ) => {
    setNewImages(
      (previousImages) => {
        return previousImages.filter(
          (_, index) =>
            index !== imageIndex,
        );
      },
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const normalizedForm =
      normalizeEditForm(form);

    const nextErrors =
      validateEditForm(
        normalizedForm,
      );

    setErrors(nextErrors);

    if (
      hasValidationError(nextErrors)
    ) {
      return;
    }

    const formData =
      createBoardFormData({
        form: normalizedForm,
        currentImages,
        newImages,
      });

    try {
      setIsSubmitting(true);

      await updateBoardRequest(
        postId,
        formData,
      );

      navigate(
        getBoardDetailPath(postId),
      );
    } catch (error) {
      console.error(
        "게시글 수정 실패:",
        error,
      );

      window.alert(
        error.message ||
          "게시글 수정에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header type="withBackAndProfile" />

      <main className="edit">
        <h2 className="title">
          게시글 수정
        </h2>

        {!isValidPostId && (
          <p className="edit__error">
            올바르지 않은 게시글
            번호입니다.
          </p>
        )}

        {isLoading && (
          <p className="edit__loading">
            게시글을 불러오는
            중입니다.
          </p>
        )}

        {!isLoading &&
          loadErrorMessage && (
            <p className="edit__error">
              {loadErrorMessage}
            </p>
          )}

        {!isLoading &&
          !loadErrorMessage &&
          isValidPostId && (
            <form
              id="editForm"
              className="edit-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="form-container">
                <div className="form__item">
                  <label
                    className="form__label"
                    htmlFor="title"
                  >
                    제목*
                  </label>

                  <input
                    id="title"
                    name="title"
                    className="form__input"
                    type="text"
                    maxLength={26}
                    value={form.title}
                    aria-describedby="titleHelper"
                    aria-invalid={
                      Boolean(
                        errors.title,
                      )
                    }
                    onChange={
                      handleInputChange
                    }
                  />

                  <p
                    id="titleHelper"
                    className="form__helper"
                  >
                    {errors.title &&
                      `* ${errors.title}`}
                  </p>
                </div>

                <div className="form__item">
                  <label
                    className="form__label"
                    htmlFor="content"
                  >
                    내용*
                  </label>

                  <textarea
                    id="content"
                    name="content"
                    className="form__textarea"
                    value={form.content}
                    aria-describedby="contentHelper"
                    aria-invalid={
                      Boolean(
                        errors.content,
                      )
                    }
                    onChange={
                      handleInputChange
                    }
                  />

                  <p
                    id="contentHelper"
                    className="form__helper"
                  >
                    {errors.content &&
                      `* ${errors.content}`}
                  </p>
                </div>

                <div className="form__item">
                  <label
                    className="form__label"
                    htmlFor="image"
                  >
                    이미지
                  </label>

                  <div className="file-field">
                    <label
                      className="file-field__button"
                      htmlFor="image"
                    >
                      파일 선택
                    </label>

                    <span
                      id="imageFileName"
                      className="file-field__name"
                    >
                      {imageFileText}
                    </span>
                  </div>

                  <input
                    id="image"
                    name="image"
                    className="file-field__input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={
                      handleImageChange
                    }
                  />

                  <ImagePreviewList
                    currentImages={
                      currentImages
                    }
                    newImages={
                      newImages
                    }
                    onDeleteCurrentImage={
                      handleDeleteCurrentImage
                    }
                    onDeleteNewImage={
                      handleDeleteNewImage
                    }
                  />
                </div>
              </div>

              <button
                className="button edit__button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "수정 중..."
                  : "수정하기"}
              </button>
            </form>
          )}
      </main>
    </>
  );
}

export default BoardEditPage;