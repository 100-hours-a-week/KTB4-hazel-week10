import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Header from "../../components/header/index.jsx";
import Input from "../../components/input/index.jsx";

import {
  deleteMyAccountRequest,
  getMyInfoRequest,
  updateMyInfoRequest,
} from "../../api/userApi.js";

import useBooleanState from "../../hooks/useBooleanState.js";
import { resolveImageUrl } from "../../utils/resolveImageUrl.js";

import "./index.css";

const LOGIN_PATH = "/login";

function handleImageError(event) {
  event.currentTarget.removeAttribute("src");
}

function UserEditPage() {
  const navigate = useNavigate();
  const toastTimerRef = useRef(null);

  const [email, setEmail] = useState("");
  const [nickname, setNickname] =
    useState("");

  const [
    nicknameError,
    setNicknameError,
  ] = useState("");

  const [
    currentProfileImage,
    setCurrentProfileImage,
  ] = useState("");

  const [
    selectedProfileImage,
    setSelectedProfileImage,
  ] = useState(null);

  const [
    previewObjectUrl,
    setPreviewObjectUrl,
  ] = useState("");

  const [isLoaded, setIsLoaded] =
    useState(false);

  const [
    loadErrorMessage,
    setLoadErrorMessage,
  ] = useState("");

  const [isToastOpen, setIsToastOpen] =
    useState(false);

  const {
    value: isSubmitting,
    setTrue: startSubmitting,
    setFalse: finishSubmitting,
  } = useBooleanState(false);

  const {
    value: isWithdrawing,
    setTrue: startWithdrawing,
    setFalse: finishWithdrawing,
  } = useBooleanState(false);

  const profileImageUrl =
    previewObjectUrl ||
    resolveImageUrl(
      currentProfileImage,
    ) ||
    undefined;

  useEffect(() => {
    document.title = "회원정보수정";
  }, []);

  useEffect(() => {
    let isCancelled = false;

    getMyInfoRequest()
      .then((response) => {
        if (isCancelled) {
          return;
        }

        const user = response.data;

        setEmail(user.email ?? "");
        setNickname(user.nickname ?? "");

        setCurrentProfileImage(
          user.profileImage ?? "",
        );

        setLoadErrorMessage("");
        setIsLoaded(true);
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }

        console.error(
          "내 정보 조회 실패:",
          error,
        );

        setLoadErrorMessage(
          error.message ||
            "회원정보를 불러오지 못했습니다.",
        );

        setIsLoaded(true);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewObjectUrl) {
        URL.revokeObjectURL(
          previewObjectUrl,
        );
      }
    };
  }, [previewObjectUrl]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(
          toastTimerRef.current,
        );
      }
    };
  }, []);

  const showToast = () => {
    if (toastTimerRef.current) {
      window.clearTimeout(
        toastTimerRef.current,
      );
    }

    setIsToastOpen(true);

    toastTimerRef.current =
      window.setTimeout(() => {
        setIsToastOpen(false);
        toastTimerRef.current = null;
      }, 1500);
  };

  const handleNicknameChange = (
    event,
  ) => {
    setNickname(event.target.value);
    setNicknameError("");
  };

  const handleProfileImageChange = (
    event,
  ) => {
    const file =
      event.target.files?.[0] ??
      null;

    if (!file) {
      return;
    }

    setSelectedProfileImage(file);
    setPreviewObjectUrl(
      URL.createObjectURL(file),
    );

    event.target.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const normalizedNickname =
      nickname.trim();

    if (!normalizedNickname) {
      setNicknameError(
        "닉네임을 입력해주세요.",
      );

      return;
    }

    const formData = new FormData();

    formData.append(
      "nickname",
      normalizedNickname,
    );

    if (selectedProfileImage) {
      formData.append(
        "profileImage",
        selectedProfileImage,
      );
    }

    try {
      startSubmitting();

      const response =
        await updateMyInfoRequest(
          formData,
        );

      setNickname(normalizedNickname);
      setNicknameError("");

      const updatedProfileImage =
        response?.data?.profileImage;

      if (updatedProfileImage) {
        setCurrentProfileImage(
          updatedProfileImage,
        );
      }

      showToast();
    } catch (error) {
      console.error(
        "회원정보 수정 실패:",
        error,
      );

      setNicknameError(
        error.message ||
          "회원정보 수정에 실패했습니다.",
      );
    } finally {
      finishSubmitting();
    }
  };

  const handleWithdraw = async () => {
    if (isWithdrawing) {
      return;
    }

    const isConfirmed =
      window.confirm(
        "회원 탈퇴하시겠습니까?",
      );

    if (!isConfirmed) {
      return;
    }

    try {
      startWithdrawing();

      await deleteMyAccountRequest();

      localStorage.removeItem(
        "accessToken",
      );

      localStorage.removeItem(
        "tokenType",
      );

      localStorage.removeItem(
        "userId",
      );

      navigate(LOGIN_PATH, {
        replace: true,
      });
    } catch (error) {
      console.error(
        "회원 탈퇴 실패:",
        error,
      );

      window.alert(
        error.message ||
          "회원 탈퇴에 실패했습니다.",
      );
    } finally {
      finishWithdrawing();
    }
  };

  return (
    <>
      <Header type="withProfile" />

      <main className="user-edit">
        <h2 className="title">
          회원정보수정
        </h2>

        {!isLoaded && (
          <p className="user-edit__loading">
            회원정보를 불러오는 중입니다.
          </p>
        )}

        {isLoaded &&
          loadErrorMessage && (
            <p className="user-edit__error">
              {loadErrorMessage}
            </p>
          )}

        {isLoaded &&
          !loadErrorMessage && (
            <>
              <form
                id="userEditForm"
                className="user-edit-form"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="profile-field">
                  <p className="profile-field__label">
                    프로필 사진*
                  </p>

                  <label
                    className="profile-field__button"
                    htmlFor="profileImage"
                  >
                    <img
                      id="profilePreview"
                      className="profile-field__image"
                      src={profileImageUrl}
                      alt="프로필 사진"
                      onError={
                        handleImageError
                      }
                    />

                    <span className="profile-field__overlay">
                      변경
                    </span>
                  </label>

                  <input
                    id="profileImage"
                    name="profileImage"
                    className="profile-field__input"
                    type="file"
                    accept="image/*"
                    onChange={
                      handleProfileImageChange
                    }
                  />
                </div>

                <div className="form-container">
                  <div className="form__item">
                    <span className="form__label">
                      이메일
                    </span>

                    <p
                      id="emailText"
                      className="form__text"
                    >
                      {email}
                    </p>
                  </div>

                  <Input
                    id="nickname"
                    name="nickname"
                    label="닉네임"
                    type="text"
                    placeholder="닉네임을 입력하세요"
                    required
                    value={nickname}
                    helperText={
                      nicknameError
                    }
                    onChange={
                      handleNicknameChange
                    }
                  />
                </div>

                <button
                  className="user-edit__button"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "수정 중..."
                    : "수정하기"}
                </button>
              </form>

              <button
                id="withdrawButton"
                className="user-edit__withdraw-button"
                type="button"
                disabled={isWithdrawing}
                onClick={handleWithdraw}
              >
                {isWithdrawing
                  ? "탈퇴 처리 중..."
                  : "회원 탈퇴"}
              </button>
            </>
          )}

        <div
          id="toast"
          className={
            `toast${
              isToastOpen
                ? " is-active"
                : ""
            }`
          }
          role="status"
          aria-live="polite"
        >
          수정완료
        </div>
      </main>
    </>
  );
}

export default UserEditPage;