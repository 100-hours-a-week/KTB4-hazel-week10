import { useEffect, useState } from "react";

import Header from "../../components/header/index.jsx"
import Input from "../../components/input/index.jsx";
import { signupRequest } from "@/api/authApi.js";
import { INITIAL_FORM, INITIAL_ERRORS } from "./initialState.js"
import { isValidPassword, isValidEmail } from "../../utils/validation/signupValidation.js";
import "./index.css";

function SignupPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);

  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0] ?? null;

    setProfileImage(file);

    setErrors((previousErrors) => ({
      ...previousErrors,
      profileImage: "",
    }));

    setPreviewUrl((previousUrl) => {
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }

      return file ? URL.createObjectURL(file) : "";
    });
  };

  const validateForm = () => {
    const email = form.email.trim();
    const password = form.password.trim();
    const passwordConfirm = form.passwordConfirm.trim();
    const nickname = form.nickname.trim();

    const nextErrors = {
      ...INITIAL_ERRORS,
    };

    if (!email) {
      nextErrors.email = "이메일을 입력해주세요.";
    } else if (!isValidEmail(email)) {
      nextErrors.email = "이메일 주소 형식을 입력해주세요.";
    } else if (!password) {
      nextErrors.password = "비밀번호를 입력해주세요.";
    } else if (!isValidPassword(password)) {
      nextErrors.password =
        "비밀번호는 8자 이상 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    } else if (!passwordConfirm) {
      nextErrors.passwordConfirm =
        "비밀번호를 한번 더 입력해주세요.";
    } else if (password !== passwordConfirm) {
      nextErrors.passwordConfirm = "비밀번호가 다릅니다.";
    } else if (!nickname) {
      nextErrors.nickname = "닉네임을 입력해주세요.";
    } else if (!profileImage) {
      nextErrors.profileImage = "프로필 사진을 추가해주세요.";
    }

    setErrors(nextErrors);

    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const signupFormData = new FormData();

    signupFormData.append("email", form.email.trim());
    signupFormData.append("password", form.password.trim());
    signupFormData.append("nickname", form.nickname.trim());
    signupFormData.append("profileImage", profileImage);

    try {
      setIsSubmitting(true);

      await signupRequest(signupFormData);

      alert("회원가입이 완료되었습니다.");
      window.location.href = "../loginPage/login.html";
    } catch (error) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        email: error.message || "회원가입에 실패했습니다.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToLogin = () => {
    window.location.href = "../loginPage/login.html";
  };

  return (
    <>
      <Header type="withBack" />

      <main className="auth">
        <form
          id="signupForm"
          className="auth-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <h1 className="auth-form__title">회원가입</h1>

          <p className="auth-form__subtitle">
            계정을 만들고 다짐을 시작해보세요
          </p>

          <div className="profile-image-field">
            <p className="profile-image-field__label">
              프로필 사진
            </p>

            <p
              id="profileImageHelper"
              className="profile-image-field__helper"
            >
              {errors.profileImage &&
                `* ${errors.profileImage}`}
            </p>

            <label
              className="profile-image-field__button"
              htmlFor="profileImage"
              style={
                previewUrl
                  ? {
                      backgroundImage: `url("${previewUrl}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              {!previewUrl && (
                <span className="profile-image-field__plus">
                  +
                </span>
              )}
            </label>

            <input
              id="profileImage"
              name="profileImage"
              className="profile-image-field__input"
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
            />
          </div>

          <div
            id="signupFields"
            className="auth-form__fields"
          >
            <Input
              id="email"
              name="email"
              label="이메일"
              type="email"
              placeholder="이메일을 입력하세요"
              required
              autoComplete="email"
              value={form.email}
              helperText={errors.email}
              onChange={handleInputChange}
            />

            <Input
              id="password"
              name="password"
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              required
              autoComplete="new-password"
              value={form.password}
              helperText={errors.password}
              onChange={handleInputChange}
            />

            <Input
              id="passwordConfirm"
              name="passwordConfirm"
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 한번 더 입력하세요"
              required
              autoComplete="new-password"
              value={form.passwordConfirm}
              helperText={errors.passwordConfirm}
              onChange={handleInputChange}
            />

            <Input
              id="nickname"
              name="nickname"
              label="닉네임"
              type="text"
              placeholder="닉네임을 입력하세요"
              required
              value={form.nickname}
              helperText={errors.nickname}
              onChange={handleInputChange}
            />
          </div>

          <button
            className="auth-form__submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "가입 중..." : "회원가입"}
          </button>

          <button
            id="gotoSignup"
            className="auth-form__switch"
            type="button"
            onClick={handleGoToLogin}
          >
            이미 계정이 있으신가요?{" "}
            <span>로그인하기</span>
          </button>
        </form>
      </main>
    </>
  );
}

export default SignupPage;