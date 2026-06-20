import { cn } from "@/lib/cn";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const textareaClassName =
  "w-full rounded-lg border border-gray-200 p-3 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900";

export function Textarea({ className, ...props }: TextareaProps) {
  return <textarea className={cn(textareaClassName, className)} {...props} />;
}
