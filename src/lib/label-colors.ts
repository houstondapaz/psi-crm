import type { MessageKey } from "@/lib/i18n";

export const LABEL_COLORS = [
  "slate",
  "red",
  "orange",
  "amber",
  "green",
  "teal",
  "blue",
  "violet",
  "pink",
] as const;

export type LabelColor = (typeof LABEL_COLORS)[number];

export const LABEL_COLOR_MESSAGE_KEYS = {
  slate: "labelColors.slate",
  red: "labelColors.red",
  orange: "labelColors.orange",
  amber: "labelColors.amber",
  green: "labelColors.green",
  teal: "labelColors.teal",
  blue: "labelColors.blue",
  violet: "labelColors.violet",
  pink: "labelColors.pink",
} as const satisfies Record<LabelColor, MessageKey>;

export const LABEL_COLOR_CLASSES: Record<LabelColor, string> = {
  slate: "bg-slate-100 text-slate-700",
  red: "bg-red-100 text-red-700",
  orange: "bg-orange-100 text-orange-700",
  amber: "bg-amber-100 text-amber-700",
  green: "bg-green-100 text-green-700",
  teal: "bg-teal-100 text-teal-700",
  blue: "bg-blue-100 text-blue-700",
  violet: "bg-violet-100 text-violet-700",
  pink: "bg-pink-100 text-pink-700",
};

export const LABEL_COLOR_OPTION_STYLES: Record<
  LabelColor,
  { backgroundColor: string; color: string }
> = {
  slate: { backgroundColor: "#f1f5f9", color: "#334155" },
  red: { backgroundColor: "#fee2e2", color: "#b91c1c" },
  orange: { backgroundColor: "#ffedd5", color: "#c2410c" },
  amber: { backgroundColor: "#fef3c7", color: "#b45309" },
  green: { backgroundColor: "#dcfce7", color: "#15803d" },
  teal: { backgroundColor: "#ccfbf1", color: "#0f766e" },
  blue: { backgroundColor: "#dbeafe", color: "#1d4ed8" },
  violet: { backgroundColor: "#ede9fe", color: "#6d28d9" },
  pink: { backgroundColor: "#fce7f3", color: "#be185d" },
};

export function isLabelColor(value: string): value is LabelColor {
  return (LABEL_COLORS as readonly string[]).includes(value);
}
