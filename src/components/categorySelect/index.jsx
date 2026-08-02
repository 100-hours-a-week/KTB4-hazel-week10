import { useEffect, useRef, useState } from "react";
import { CATEGORIES, getCategoryLabel } from "@/utils/categories.js";
import "./index.css";

function CategorySelect({ id, name = "category", value, onChange, hasError }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleDocumentClick(event) {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleSelect = (nextValue) => {
    setIsOpen(false);
    onChange({ target: { name, value: nextValue } });
  };

  return (
    <div className="category-select" ref={containerRef}>
      <button
        id={id}
        type="button"
        className={`category-select__trigger ${hasError ? "is-error" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className={value ? "" : "category-select__placeholder"}>
          {value ? getCategoryLabel(value) : "카테고리를 선택해주세요"}
        </span>
        <span className="category-select__arrow" aria-hidden="true" />
      </button>

      <ul className={`category-select__menu ${isOpen ? "is-active" : ""}`} role="listbox">
        {CATEGORIES.map((category) => (
          <li key={category.value}>
            <button
              type="button"
              className={`category-select__option ${value === category.value ? "is-selected" : ""}`}
              onClick={() => handleSelect(category.value)}
            >
              {category.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategorySelect;
