import { cn } from "@/lib/utils";

export const FOOD_TYPE_OPTIONS = [
  { value: "veg", label: "Veg" },
  { value: "non_veg", label: "Non-Veg" },
  { value: "egg", label: "Egg" },
];

const STYLES = {
  veg: { border: "#15803D", fill: "#22C55E", label: "Veg" },
  non_veg: { border: "#9F1239", fill: "#BE123C", label: "Non-Veg" },
  egg: { border: "#B45309", fill: "#F59E0B", label: "Egg" },
};

export function normalizeFoodType(value) {
  const key = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[-\s]/g, "_")
    .replace(/_+/g, "_");
  if (STYLES[key]) return key;
  if (key === "nonveg" || key === "non_vegetarian") return "non_veg";
  if (key === "eggetarian" || key === "contains_egg") return "egg";
  if (key === "vegetarian") return "veg";
  return "veg";
}

export default function FoodTypeBadge({
  foodType,
  size = "sm",
  showLabel = true,
  className,
}) {
  const type = normalizeFoodType(foodType);
  const style = STYLES[type];
  const box = size === "lg" ? "w-5 h-5 border-[2.5px]" : "w-3.5 h-3.5 border-2";
  const dot = size === "lg" ? "w-2.5 h-2.5" : "w-1.5 h-1.5";

  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      title={style.label}
      aria-label={style.label}
    >
      <span
        className={`${box} flex items-center justify-center bg-white shrink-0`}
        style={{ borderColor: style.border }}
      >
        <span
          className={`${dot} rounded-full`}
          style={{ backgroundColor: style.fill }}
        />
      </span>
      {showLabel ? (
        <span
          className="text-xs font-semibold leading-none"
          style={{ color: style.border }}
        >
          {style.label}
        </span>
      ) : null}
    </span>
  );
}
