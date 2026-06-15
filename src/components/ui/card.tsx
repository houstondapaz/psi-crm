// HyperUI Application UI — Panels: https://www.hyperui.dev/components/application-ui/panels
import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 ${className}`.trim()}
      {...props}
    />
  );
}
