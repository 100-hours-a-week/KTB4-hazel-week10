import { CATEGORIES } from "@/utils/categories.js";
import "./index.css";

function CategoryFilter({ value, onChange }) {
  return (
    <div className="category-filter">
      <button
        type="button"
        className={`category-filter__button ${value === "" ? "is-active" : ""}`}
        onClick={() => onChange("")}
      >
        전체
      </button>

      {CATEGORIES.map((category) => (
        <button
          key={category.value}
          type="button"
          className={`category-filter__button ${value === category.value ? "is-active" : ""}`}
          onClick={() => onChange(category.value)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
