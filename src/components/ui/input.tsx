import { Input as BaseInput } from "@base-ui/react/input";
import { mergeClassName } from "@/lib/cn";

const inputClassName =
  "w-full rounded-lg border border-gray-200 p-3 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900";

type InputProps = React.ComponentProps<typeof BaseInput>;

export function Input({ className, ...props }: InputProps) {
  return (
    <BaseInput className={mergeClassName(inputClassName, className)} {...props} />
  );
}
