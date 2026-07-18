function ProfileImageField({
  previewUrl,
  errorMessage,
  onChange,
}) {
  const previewStyle = previewUrl
    ? {
        backgroundImage: `url("${previewUrl}")`,
      }
    : undefined;

  return (
    <div className="profile-image-field">
      <p className="profile-image-field__label">
        프로필 사진
      </p>

      <p
        id="profileImageHelper"
        className="profile-image-field__helper"
      >
        {errorMessage && `* ${errorMessage}`}
      </p>

      <label
        className="profile-image-field__button"
        htmlFor="profileImage"
        style={previewStyle}
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
        aria-describedby="profileImageHelper"
        aria-invalid={Boolean(errorMessage)}
        onChange={onChange}
      />
    </div>
  );
}

export default ProfileImageField;