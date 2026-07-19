import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/header/index.jsx";
import Input from "../../components/input/index.jsx";
import { signupRequest } from "@/api/authApi.js";
import useBooleanState from "../../utils/useBooleanState.js"

import ProfileImageField from "./components/ProfileImageField.jsx";
import { INITIAL_FORM, INITIAL_ERRORS } from "./initialState.js";
import { INPUT_FIELDS } from "./signupFields.js";

import {
  createSignupFormData,
  hasValidationError,
  normalizeSignupForm,
  validateSignupForm,
} from "./signupFormUtils.js";

import "./index.css";

const LOGIN_PATH = "/login";

function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const {
    value: isSubmitting,
    setTrue: startSubmitting,
    setFalse: finishSubmitting,
  } = useBooleanState(false);

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
    setPreviewUrl(file ? URL.createObjectURL(file) : "");

    setErrors((previousErrors) => ({
      ...previousErrors,
      profileImage: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedForm = normalizeSignupForm(form);

    const nextErrors = validateSignupForm(
      normalizedForm,
      profileImage,
    );

    setErrors(nextErrors);

    if (hasValidationError(nextErrors)) {
      return;
    }

    const signupFormData = createSignupFormData(
      normalizedForm,
      profileImage,
    );

    try {
      startSubmitting();

      await signupRequest(signupFormData);

      alert("회원가입이 완료되었습니다.");
      navigate(LOGIN_PATH);
    } catch (error) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        email:
          error.message || "회원가입에 실패했습니다.",
      }));
    } finally {
      finishSubmitting();
    }
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
          <h1 className="auth-form__title">
            회원가입
          </h1>

          <p className="auth-form__subtitle">
            계정을 만들고 다짐을 시작해보세요
          </p>

          <ProfileImageField
            previewUrl={previewUrl}
            errorMessage={errors.profileImage}
            onChange={handleProfileImageChange}
          />

          <div
            id="signupFields"
            className="auth-form__fields"
          >
            {INPUT_FIELDS.map((field) => (
              <Input
                key={field.id}
                {...field}
                required
                value={form[field.name]}
                helperText={errors[field.name]}
                onChange={handleInputChange}
              />
            ))}
          </div>

          <button
            className="auth-form__submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "가입 중..."
              : "회원가입"}
          </button>

          <button
            id="gotoSignup"
            className="auth-form__switch"
            type="button"
            onClick={() => navigate(LOGIN_PATH)}
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