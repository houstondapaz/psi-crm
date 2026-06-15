import { LABEL_COLOR_CLASSES, type LabelColor } from "@/lib/label-colors";

type LabelChipProps = {
  name: string;
  color: LabelColor;
  className?: string;
};

export function LabelChip({ name, color, className = "" }: LabelChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${LABEL_COLOR_CLASSES[color]} ${className}`.trim()}
    >
      {name}
    </span>
  );
}
