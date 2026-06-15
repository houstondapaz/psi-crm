// HyperUI Application UI — Badges: https://www.hyperui.dev/components/application-ui/badges
import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "warning" | "danger" | "success";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  success: "bg-green-100 text-green-700",
};

export function Badge({
  variant = "default",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    />
  );
}
