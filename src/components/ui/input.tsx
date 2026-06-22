"use client";

import { useState } from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import { mergeClassName } from "@/lib/cn";

const inputClassName =
  "w-full rounded-lg border border-gray-200 p-3 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900";

type InputProps = React.ComponentProps<typeof BaseInput>;

export function Input({
  className,
  defaultValue,
  value,
  onValueChange,
  ...props
}: InputProps) {
  const isControlled = value !== undefined;
  const hasDefaultValue = defaultValue !== undefined;
  const [internalValue, setInternalValue] = useState(() => defaultValue ?? "");

  const inputValue = isControlled
    ? value
    : hasDefaultValue
      ? internalValue
      : undefined;

  function handleValueChange(
    nextValue: string,
    eventDetails: Parameters<NonNullable<InputProps["onValueChange"]>>[1],
  ) {
    if (!isControlled && hasDefaultValue) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue, eventDetails);
  }

  return (
    <BaseInput
      className={mergeClassName(inputClassName, className)}
      {...(inputValue !== undefined ? { value: inputValue } : {})}
      onValueChange={handleValueChange}
      {...props}
    />
  );
}
