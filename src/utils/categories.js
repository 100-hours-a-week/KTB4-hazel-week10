export const CATEGORIES = [
  { value: "FRONTEND", label: "FE" },
  { value: "BACKEND", label: "BE" },
  { value: "CS", label: "CS" },
];

export function getCategoryLabel(category) {
  return CATEGORIES.find((item) => item.value === category)?.label ?? category;
}
