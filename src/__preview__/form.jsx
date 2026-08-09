import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import FormSkeleton from "@/components/skeleton/FormSkeleton.jsx";
import UserEditForm from "@/pages/userEditPage/components/UserEditForm.jsx";
import { INITIAL_USER } from "@/pages/userEditPage/initialState.js";
import "@/index.css";

const page = new URLSearchParams(location.search).get("page") ?? "user";

function UserEditPreview() {
  return (
    <main className="user-edit">
      <UserEditForm
        user={{ ...INITIAL_USER, email: "sera@example.com", nickname: "hazel" }}
        profileImageUrl=""
        nicknameError=""
        isSubmitting={false}
        onNicknameChange={() => {}}
        onProfileImageChange={() => {}}
        onSubmit={(event) => event.preventDefault()}
      />

      <div className="user-edit-form">
        <FormSkeleton hasAvatar fieldHeights={[20, 44]} label="회원정보를 불러오는 중입니다." />
      </div>
    </main>
  );
}

function NotificationPreview() {
  return (
    <main className="notification-settings-page">
      <form className="notification-settings-form">
        <p className="notification-settings__description">
          선정된 질문이 매일 아침 디스코드로 전달될 때, 받고 싶은 카테고리와 디스코드 사용자 ID를 설정하세요.
        </p>

        <div className="notification-settings__field">
          <span className="notification-settings__label">디스코드 연동</span>
          <div className="notification-settings__discord-connect">
            <span className="notification-settings__discord-status">연동됨</span>
            <button className="notification-settings__discord-button" type="button">다시 연동</button>
          </div>
        </div>

        <div className="notification-settings__field">
          <span className="notification-settings__label">받을 카테고리</span>
          <div className="notification-settings__categories">
            <label className="notification-settings__checkbox"><input type="checkbox" readOnly checked />프론트엔드</label>
            <label className="notification-settings__checkbox"><input type="checkbox" readOnly />백엔드</label>
            <label className="notification-settings__checkbox"><input type="checkbox" readOnly />CS</label>
          </div>
        </div>

        <button className="notification-settings__submit" type="button">저장하기</button>
      </form>

      <div className="notification-settings-form">
        <FormSkeleton fieldHeights={[58, 42]} label="알림 설정을 불러오는 중입니다." />
      </div>
    </main>
  );
}

function BoardEditPreview() {
  return (
    <main className="edit">
      <form className="edit-form">
        <div className="form-container">
          <div className="form__item">
            <label className="form__label" htmlFor="title">질문*</label>
            <input className="form__input" id="title" readOnly />
            <p className="form__helper" />
          </div>

          <div className="form__item">
            <label className="form__label" htmlFor="category">카테고리*</label>
            <input className="form__input" id="category" readOnly />
            <p className="form__helper" />
          </div>

          <div className="form__item">
            <label className="form__label" htmlFor="content">내용*</label>
            <textarea className="form__textarea" id="content" readOnly />
            <p className="form__helper" />
          </div>
        </div>

        <button className="edit__button" type="button">수정하기</button>
      </form>

      <div className="edit-form">
        <FormSkeleton fieldHeights={[44, 44, 260]} label="질문을 불러오는 중입니다." />
      </div>
    </main>
  );
}

const pages = {
  user: { render: () => <UserEditPreview />, css: () => import("@/pages/userEditPage/index.css") },
  notification: { render: () => <NotificationPreview />, css: () => import("@/pages/notificationSettingsPage/index.css") },
  edit: { render: () => <BoardEditPreview />, css: () => import("@/pages/boardEditPage/index.css") },
};

const selected = pages[page];

selected.css().then(() => {
  createRoot(document.getElementById("root")).render(<StrictMode>{selected.render()}</StrictMode>);
});
