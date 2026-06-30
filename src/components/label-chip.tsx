import {
  getLabelColorStyle,
  resolveLabelColor,
  type LabelColor,
} from "@/lib/label-colors";

type LabelChipProps = {
  name: string;
  color: LabelColor | string;
  className?: string;
};

export function LabelChip({ name, color, className = "" }: LabelChipProps) {
  const resolved = resolveLabelColor(color);
  const { backgroundColor } = getLabelColorStyle(resolved);
  const red = Number.parseInt(backgroundColor.slice(1, 3), 16);
  const green = Number.parseInt(backgroundColor.slice(3, 5), 16);
  const blue = Number.parseInt(backgroundColor.slice(5, 7), 16);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`.trim()}
      style={{
        backgroundColor: `rgba(${red}, ${green}, ${blue}, 0.18)`,
        color: backgroundColor,
      }}
    >
      {name}
    </span>
  );
}
