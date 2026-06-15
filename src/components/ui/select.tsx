// HyperUI Application UI — Selects: https://www.hyperui.dev/components/application-ui/selects
import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className = "", ...props }: SelectProps) {
  return (
    <select
      className={`w-full rounded-lg border border-gray-200 p-3 text-sm shadow-sm focus:border-gray-900 focus:ring-gray-900 ${className}`.trim()}
      {...props}
    />
  );
}
