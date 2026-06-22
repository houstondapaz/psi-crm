import { cn } from "@/lib/cn";

const nativeSelectClassName =
  "w-full appearance-none rounded-lg border border-gray-200 bg-white p-3 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900";

type NativeSelectProps = React.ComponentProps<"select">;

export function NativeSelect({ className, ...props }: NativeSelectProps) {
  return (
    <select className={cn(nativeSelectClassName, className)} {...props} />
  );
}
