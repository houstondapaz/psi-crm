// HyperUI Application UI — Inputs: https://www.hyperui.dev/components/application-ui/inputs
import type { LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className = "", ...props }: LabelProps) {
  return (
    <label
      className={`block text-sm font-medium text-gray-700 ${className}`.trim()}
      {...props}
    />
  );
}
