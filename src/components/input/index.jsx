import "./index.css";

function Input({
  id,
  name,
  label,
  type = "text",
  placeholder = "",
  required = false,
  helperText = "",
  value = "",
  autoComplete = "",
  onChange,
}) {
  return (
    <div className="input-field">
      <label className="input-field__label" htmlFor={id}>
        {label}
        {required ? "*" : ""}
      </label>

      <input
        id={id}
        name={name}
        className="input-field__input"
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={onChange}
      />

      <p id={`${id}Helper`} className="input-field__helper">
        {helperText ? `* ${helperText}` : ""}
      </p>
    </div>
  );
}

export default Input;
