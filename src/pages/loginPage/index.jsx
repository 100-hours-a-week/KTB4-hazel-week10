import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header/index.jsx";
import Input from "@/components/input/index.jsx";
import { loginRequest } from "@/api/authApi.js";
import { INITIAL_FORM_VALUES, INITIAL_HELPER_TEXTS } from "./initialState";
import "./index.css";

function validateForm({ email, password }) {
  const errors = { ...INITIAL_HELPER_TEXTS };

  if (!email.trim()) {
    errors.email = "이메일을 입력해주세요.";
  }

  if (!password) {
    errors.password = "비밀번호를 입력해주세요.";
  }

  return errors;
}

function hasValidationError(errors) {
  return Object.values(errors).some(Boolean);
}

function saveLoginData({ accessToken, tokenType, userId }) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("tokenType", tokenType);
  localStorage.setItem("userId", String(userId));
}

function LoginPage() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [helperTexts, setHelperTexts] = useState(INITIAL_HELPER_TEXTS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setHelperTexts((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateForm(formValues);
    setHelperTexts(errors);

    if (hasValidationError(errors)) {
      return;
    }

    try {
      setIsSubmitting(true);

      const { data } = await loginRequest({
        email: formValues.email.trim(),
        password: formValues.password,
      });

      saveLoginData(data);
      navigate("/boards", { replace: true });
    } catch (error) {
      console.error("로그인 요청 실패:", error);

      setHelperTexts((prev) => ({
        ...prev,
        password: "이메일 또는 비밀번호가 올바르지 않습니다.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <main className="auth">
        <form className="auth-form" noValidate onSubmit={handleSubmit}>
          <h1 className="auth-form__title">로그인</h1>
          <p className="auth-form__subtitle">다짐을 이어가볼까요?</p>

          <div className="auth-form__fields">
            <Input
              id="email"
              name="email"
              label="이메일"
              type="email"
              placeholder="이메일을 입력하세요"
              required
              helperText={helperTexts.email}
              autoComplete="email"
              value={formValues.email}
              onChange={handleChange}
            />

            <Input
              id="password"
              name="password"
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              required
              helperText={helperTexts.password}
              autoComplete="current-password"
              value={formValues.password}
              onChange={handleChange}
            />
          </div>

          <button
            className="auth-form__submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>

          <button
            className="auth-form__switch"
            type="button"
            onClick={() => navigate("/signup")}
          >
            아직 계정이 없으신가요? <span>회원가입</span>
          </button>
        </form>
      </main>
    </>
  );
}

export default LoginPage;