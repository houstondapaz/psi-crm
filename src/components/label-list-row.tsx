import type { ReactNode } from "react";
import type { LabelColor } from "@/lib/label-colors";
import { LabelPill } from "@/components/label-pill";

type LabelListRowProps = {
  name: string;
  color: LabelColor | string;
  checked?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  trailing?: ReactNode;
};

export function LabelListRow({
  name,
  color,
  checked,
  onToggle,
  onClick,
  disabled = false,
  trailing,
}: LabelListRowProps) {
  const pill = <LabelPill name={name} color={color} />;

  return (
    <div className="flex items-center gap-2">
      {onToggle !== undefined && (
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onToggle}
          aria-label={name}
          className="size-4 shrink-0 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
        />
      )}
      {onToggle !== undefined ? (
        <button
          type="button"
          disabled={disabled}
          onClick={onToggle}
          className="min-w-0 flex-1 cursor-pointer rounded transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pill}
        </button>
      ) : onClick !== undefined ? (
        <button
          type="button"
          disabled={disabled}
          onClick={onClick}
          aria-label={name}
          className="min-w-0 flex-1 cursor-pointer rounded transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pill}
        </button>
      ) : (
        <div className="min-w-0 flex-1">{pill}</div>
      )}
      {trailing}
    </div>
  );
}
