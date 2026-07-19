import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header/index.jsx";
import { deleteMyAccountRequest, getMyInfoRequest, updateMyInfoRequest } from "@/api/userApi.js";
import useBooleanState from "@/utils/useBooleanState.js";
import { resolveImageUrl } from "@/utils/resolveImageUrl.js";
import UserEditForm from "./components/UserEditForm.jsx";
import { clearAuthData, createUserEditFormData } from "./userEditUtils.js";
import { INITIAL_USER } from "./initialState.js";
import "./index.css";

function UserEditPage() {
  const navigate = useNavigate();
  const toastTimerRef = useRef(null);

  const [user, setUser] = useState(INITIAL_USER);
  const [nicknameError, setNicknameError] = useState("");
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadErrorMessage, setLoadErrorMessage] = useState("");
  const [isToastOpen, setIsToastOpen] = useState(false);

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
    previewUrl || resolveImageUrl(user.profileImage) || undefined;

  useEffect(() => {
    document.title = "회원정보수정";
  }, []);

  useEffect(() => {
    let isCancelled = false;

    getMyInfoRequest()
      .then(({ data }) => {
        if (isCancelled) {
          return;
        }

        setUser({
          email: data.email ?? "",
          nickname: data.nickname ?? "",
          profileImage: data.profileImage ?? "",
        });
        setLoadErrorMessage("");
        setIsLoaded(true);
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }

        console.error("내 정보 조회 실패:", error);
        setLoadErrorMessage(
          error.message || "회원정보를 불러오지 못했습니다.",
        );
        setIsLoaded(true);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = () => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setIsToastOpen(true);

    toastTimerRef.current = window.setTimeout(() => {
      setIsToastOpen(false);
      toastTimerRef.current = null;
    }, 1500);
  };

  const handleNicknameChange = ({ target: { value } }) => {
    setUser((prev) => ({
      ...prev,
      nickname: value,
    }));
    setNicknameError("");
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    event.target.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const nickname = user.nickname.trim();

    if (!nickname) {
      setNicknameError("닉네임을 입력해주세요.");
      return;
    }

    const formData = createUserEditFormData(nickname, selectedProfileImage);

    try {
      startSubmitting();

      const response = await updateMyInfoRequest(formData);
      const updatedProfileImage = response?.data?.profileImage;

      setUser((prev) => ({
        ...prev,
        nickname,
        profileImage: updatedProfileImage || prev.profileImage,
      }));
      setNicknameError("");
      showToast();
    } catch (error) {
      console.error("회원정보 수정 실패:", error);
      setNicknameError(error.message || "회원정보 수정에 실패했습니다.");
    } finally {
      finishSubmitting();
    }
  };

  const handleWithdraw = async () => {
    if (isWithdrawing) {
      return;
    }

    const isConfirmed = window.confirm("회원 탈퇴하시겠습니까?");

    if (!isConfirmed) {
      return;
    }

    try {
      startWithdrawing();

      await deleteMyAccountRequest();
      clearAuthData();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      window.alert(error.message || "회원 탈퇴에 실패했습니다.");
    } finally {
      finishWithdrawing();
    }
  };

  return (
    <>
      <Header type="withProfile" />

      <main className="user-edit">
        <h2 className="title">회원정보수정</h2>

        {!isLoaded && (
          <p className="user-edit__loading">
            회원정보를 불러오는 중입니다.
          </p>
        )}

        {isLoaded && loadErrorMessage && (
          <p className="user-edit__error">{loadErrorMessage}</p>
        )}

        {isLoaded && !loadErrorMessage && (
          <>
            <UserEditForm
              user={user}
              profileImageUrl={profileImageUrl}
              nicknameError={nicknameError}
              isSubmitting={isSubmitting}
              onNicknameChange={handleNicknameChange}
              onProfileImageChange={handleProfileImageChange}
              onSubmit={handleSubmit}
            />

            <button
              className="user-edit__withdraw-button"
              type="button"
              disabled={isWithdrawing}
              onClick={handleWithdraw}
            >
              {isWithdrawing ? "탈퇴 처리 중..." : "회원 탈퇴"}
            </button>
          </>
        )}

        <div
          className={`toast${isToastOpen ? " is-active" : ""}`}
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
