// HyperUI Application UI — Inputs: https://www.hyperui.dev/components/application-ui/inputs
import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full rounded-lg border border-gray-200 p-3 text-sm shadow-sm focus:border-gray-900 focus:ring-gray-900 ${className}`.trim()}
      {...props}
    />
  );
}
