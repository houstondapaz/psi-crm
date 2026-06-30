import {
  getLabelColorStyle,
  resolveLabelColor,
  type LabelColor,
} from "@/lib/label-colors";

type LabelPillProps = {
  name: string;
  color: LabelColor | string;
  className?: string;
};

export function LabelPill({ name, color, className = "" }: LabelPillProps) {
  const resolved = resolveLabelColor(color);
  const style = getLabelColorStyle(resolved);

  return (
    <span
      className={`block w-full truncate rounded-md px-3 py-2 text-center text-sm font-medium ${className}`.trim()}
      style={style}
    >
      {name || "\u00A0"}
    </span>
  );
}
