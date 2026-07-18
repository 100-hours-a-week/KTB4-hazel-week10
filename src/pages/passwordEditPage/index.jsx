import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Header from "../../components/header/index.jsx";
import Input from "../../components/input/index.jsx";

import { changePasswordRequest } from "../../api/userApi.js";
import { isValidPassword } from "../../utils/validation/signupValidation.js";
import useBooleanState from "../../hooks/useBooleanState.js";

import "./index.css";

const BOARD_LIST_PATH = "/boards";

const INITIAL_FORM = {
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
};

const INITIAL_ERRORS = {
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
};

const PASSWORD_FIELDS = [
  {
    id: "currentPassword",
    name: "currentPassword",
    label: "현재 비밀번호",
    type: "password",
    placeholder:
      "현재 비밀번호를 입력하세요",
    autoComplete: "current-password",
  },
  {
    id: "newPassword",
    name: "newPassword",
    label: "새 비밀번호",
    type: "password",
    placeholder:
      "새 비밀번호를 입력하세요",
    autoComplete: "new-password",
  },
  {
    id: "newPasswordConfirm",
    name: "newPasswordConfirm",
    label: "새 비밀번호 확인",
    type: "password",
    placeholder:
      "새 비밀번호를 한번 더 입력하세요",
    autoComplete: "new-password",
  },
];

function normalizePasswordForm(form) {
  return {
    currentPassword:
      form.currentPassword.trim(),

    newPassword:
      form.newPassword.trim(),

    newPasswordConfirm:
      form.newPasswordConfirm.trim(),
  };
}

function validatePasswordForm(form) {
  const errors = {
    ...INITIAL_ERRORS,
  };

  if (!form.currentPassword) {
    errors.currentPassword =
      "현재 비밀번호를 입력해주세요.";

    return errors;
  }

  if (!form.newPassword) {
    errors.newPassword =
      "새 비밀번호를 입력해주세요.";

    return errors;
  }

  if (
    !isValidPassword(
      form.newPassword,
    )
  ) {
    errors.newPassword =
      "비밀번호는 8자 이상 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";

    return errors;
  }

  if (!form.newPasswordConfirm) {
    errors.newPasswordConfirm =
      "새 비밀번호를 한번 더 입력해주세요.";

    return errors;
  }

  if (
    form.newPassword !==
    form.newPasswordConfirm
  ) {
    errors.newPasswordConfirm =
      "비밀번호가 다릅니다.";
  }

  return errors;
}

function hasValidationError(errors) {
  return Object.values(errors).some(Boolean);
}

function PasswordEditPage() {
  const navigate = useNavigate();

  const [form, setForm] =
    useState(INITIAL_FORM);

  const [errors, setErrors] =
    useState(INITIAL_ERRORS);

  const {
    value: isSubmitting,
    setTrue: startSubmitting,
    setFalse: finishSubmitting,
  } = useBooleanState(false);

  useEffect(() => {
    document.title = "비밀번호 수정";
  }, []);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const normalizedForm =
      normalizePasswordForm(form);

    const nextErrors =
      validatePasswordForm(
        normalizedForm,
      );

    setErrors(nextErrors);

    if (
      hasValidationError(nextErrors)
    ) {
      return;
    }

    const updatePayload = {
      currentPassword:
        normalizedForm.currentPassword,

      newPassword:
        normalizedForm.newPassword,
    };

    try {
      startSubmitting();

      await changePasswordRequest(
        updatePayload,
      );

      window.alert(
        "비밀번호가 수정되었습니다.",
      );

      navigate(BOARD_LIST_PATH);
    } catch (error) {
      console.error(
        "비밀번호 수정 실패:",
        error,
      );

      setErrors(
        (previousErrors) => ({
          ...previousErrors,

          currentPassword:
            error.message ||
            "비밀번호 수정에 실패했습니다.",
        }),
      );
    } finally {
      finishSubmitting();
    }
  };

  return (
    <>
      <Header type="withProfile" />

      <main className="password-edit">
        <h2 className="title">
          비밀번호 수정
        </h2>

        <form
          id="passwordEditForm"
          className="password-edit-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div
            id="passwordEditFields"
            className="form-container"
          >
            {PASSWORD_FIELDS.map(
              (field) => (
                <Input
                  key={field.id}
                  {...field}
                  required
                  value={
                    form[field.name]
                  }
                  helperText={
                    errors[field.name]
                  }
                  onChange={
                    handleInputChange
                  }
                />
              ),
            )}
          </div>

          <button
            className="button password-edit__button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "수정 중..."
              : "수정하기"}
          </button>
        </form>
      </main>
    </>
  );
}

export default PasswordEditPage;