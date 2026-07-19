import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/index.jsx";
import Input from "../../components/input/index.jsx";
import { changePasswordRequest } from "../../api/userApi.js";
import useBooleanState from "../../utils/isBooleanState.js";
import { INITIAL_ERRORS, INITIAL_FORM } from "./initialState.js";
import { PASSWORD_FIELDS } from "./passwordEditFields.js";
import { hasValidationError, normalizePasswordForm, validatePasswordForm } from "./passwordEditValidation.js";
import "./index.css";

const BOARD_LIST_PATH = "/boards";

function PasswordEditPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const { value: isSubmitting, setTrue: startSubmitting, setFalse: finishSubmitting } = useBooleanState(false);

  useEffect(() => {
    document.title = "비밀번호 수정";
  }, []);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const normalizedForm = normalizePasswordForm(form);
    const nextErrors = validatePasswordForm(normalizedForm);

    setErrors(nextErrors);

    if (hasValidationError(nextErrors)) {
      return;
    }

    const updatePayload = {
      currentPassword: normalizedForm.currentPassword,
      newPassword: normalizedForm.newPassword,
    };

    try {
      startSubmitting();

      await changePasswordRequest(updatePayload);

      window.alert("비밀번호가 수정되었습니다.");
      navigate(BOARD_LIST_PATH);
    } catch (error) {
      console.error("비밀번호 수정 실패:", error);

      setErrors((prev) => ({
        ...prev,
        currentPassword: error.message || "비밀번호 수정에 실패했습니다.",
      }));
    } finally {
      finishSubmitting();
    }
  };

  return (
    <>
      <Header type="withProfile" />

      <main className="password-edit">
        <h2 className="title">비밀번호 수정</h2>

        <form
          id="passwordEditForm"
          className="password-edit-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div id="passwordEditFields" className="form-container">
            {PASSWORD_FIELDS.map((field) => (
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
            className="button password-edit__button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "수정 중..." : "수정하기"}
          </button>
        </form>
      </main>
    </>
  );
}

export default PasswordEditPage;