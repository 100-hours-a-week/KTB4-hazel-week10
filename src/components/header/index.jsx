import { useEffect, useRef, useState } from "react";
import { logoutRequest } from "@/api/authApi.js";
import { getMyInfoRequest } from "@/api/userApi.js";
import { resolveImageUrl } from "@/utils/resolveImageUrl.js";

function Header({ type = "default" }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  const hasBack = type === "withBack" || type === "withBackAndProfile";
  const hasProfile = type === "withProfile" || type === "withBackAndProfile";

  useEffect(() => {
    async function loadHeaderProfileImage() {
      if (!hasProfile || !localStorage.getItem("accessToken")) return;

      try {
        const response = await getMyInfoRequest();
        const user = response?.data;

        if (!user?.profileImage) return;

        setProfileImageUrl(resolveImageUrl(user.profileImage));
      } catch (error) {
        console.error("헤더 프로필 이미지 조회 실패:", error);
      }
    }

    loadHeaderProfileImage();
  }, [hasProfile]);

  useEffect(() => {
    function handleDocumentClick(event) {
      if (
        dropdownRef.current?.contains(event.target) ||
        profileButtonRef.current?.contains(event.target)
      ) {
        return;
      }

      setIsDropdownOpen(false);
    }

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleBackClick = () => {
    window.history.back();
  };

  const handleProfileEditClick = () => {
    window.location.href = "../userEditPage/userEdit.html";
  };

  const handlePasswordEditClick = () => {
    window.location.href = "../passwordEditPage/passwordEdit.html";
  };

  const handleLogoutClick = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("tokenType");
      localStorage.removeItem("userId");

      window.location.href = "../loginPage/login.html";
    }
  };

  const getInnerClassName = () => {
    if (type === "withProfile") {
      return "header__inner header__inner--with-profile";
    }

    if (type === "withBack") {
      return "header__inner header__inner--with-back";
    }

    if (type === "withBackAndProfile") {
      return "header__inner header__inner--with-back-profile";
    }

    return "header__inner";
  };

  return (
    <header className="header">
      <div className={getInnerClassName()}>
        {hasBack ? (
          <button
            className="header__back-button"
            type="button"
            aria-label="뒤로가기"
            onClick={handleBackClick}
          >
            &lt;
          </button>
        ) : hasProfile ? (
          <div className="header__left-space" />
        ) : null}

        <h1 className="header__title">작심삼일</h1>

        {hasProfile ? (
          <div className="header__profile-wrapper">
            <button
              ref={profileButtonRef}
              className="header__profile-button"
              type="button"
              aria-label="프로필 메뉴"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <img
                className="header__profile-image"
                src={profileImageUrl || undefined}
                alt=""
                onError={() => setProfileImageUrl("")}
              />
            </button>

            <div
              ref={dropdownRef}
              className={`header__dropdown ${isDropdownOpen ? "is-active" : ""}`}
            >
              <button
                className="header__dropdown-item header__menu-profile-edit"
                type="button"
                onClick={handleProfileEditClick}
              >
                회원정보수정
              </button>
              <button
                className="header__dropdown-item header__menu-password-edit"
                type="button"
                onClick={handlePasswordEditClick}
              >
                비밀번호수정
              </button>
              <button
                className="header__dropdown-item header__menu-logout"
                type="button"
                onClick={handleLogoutClick}
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : hasBack ? (
          <div className="header__right-space" />
        ) : null}
      </div>
    </header>
  );
}

export default header;