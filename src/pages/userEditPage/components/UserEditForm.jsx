import Input from "@/components/input/index.jsx";

function handleImageError(event) {
  event.currentTarget.removeAttribute("src");
}

function UserEditForm({
  user,
  profileImageUrl,
  nicknameError,
  isSubmitting,
  onNicknameChange,
  onProfileImageChange,
  onSubmit,
}) {
  return (
    <form className="user-edit-form" onSubmit={onSubmit} noValidate>
      <div className="profile-field">
        <p className="profile-field__label">프로필 사진*</p>

        <label className="profile-field__button" htmlFor="profileImage">
          <img
            className="profile-field__image"
            src={profileImageUrl}
            alt="프로필 사진"
            onError={handleImageError}
          />
          <span className="profile-field__overlay">변경</span>
        </label>

        <input
          id="profileImage"
          name="profileImage"
          className="profile-field__input"
          type="file"
          accept="image/*"
          onChange={onProfileImageChange}
        />
      </div>

      <div className="form-container">
        <div className="form__item">
          <span className="form__label">이메일</span>
          <p className="form__text">{user.email}</p>
        </div>

        <Input
          id="nickname"
          name="nickname"
          label="닉네임"
          type="text"
          placeholder="닉네임을 입력하세요"
          required
          value={user.nickname}
          helperText={nicknameError}
          onChange={onNicknameChange}
        />
      </div>

      <button
        className="user-edit__button"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "수정 중..." : "수정하기"}
      </button>
    </form>
  );
}

export default UserEditForm;