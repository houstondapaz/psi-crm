import { Button as BaseButton } from "@base-ui/react/button";
import { mergeClassName } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = React.ComponentProps<typeof BaseButton> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "rounded-sm bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:not-data-disabled:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 data-disabled:opacity-50",
  secondary:
    "rounded-sm border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:not-data-disabled:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 data-disabled:opacity-50",
  ghost:
    "rounded-sm px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:not-data-disabled:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 data-disabled:opacity-50",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      className={mergeClassName(
        `inline-block select-none ${variantClasses[variant]}`,
        className,
      )}
      {...props}
    />
  );
}
