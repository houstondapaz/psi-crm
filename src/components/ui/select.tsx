"use client";

import {
  Children,
  isValidElement,
  type ReactNode,
} from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { CheckIcon, ChevronUpDownIcon } from "@/components/ui/icons";
import { mergeClassName } from "@/lib/cn";

type SelectOption = {
  label: ReactNode;
  value: string;
  disabled?: boolean;
};

function parseOptions(children: ReactNode): SelectOption[] {
  const options: SelectOption[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === "option") {
      const props = child.props as {
        value?: string;
        disabled?: boolean;
        children?: ReactNode;
      };

      options.push({
        value: props.value ?? "",
        label: props.children ?? props.value ?? "",
        disabled: props.disabled,
      });
    }
  });

  return options;
}

type SelectProps = {
  id?: string;
  name?: string;
  className?: string;
  defaultValue?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  children: ReactNode;
  onValueChange?: (value: string | null) => void;
};

const triggerClassName =
  "flex w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white p-3 text-left text-sm shadow-sm focus-visible:border-gray-900 focus-visible:outline-none focus-visible:ring-gray-900 data-disabled:opacity-50 data-popup-open:border-gray-900";

const popupClassName =
  "z-50 min-w-[var(--anchor-width)] origin-[var(--transform-origin)] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0";

const itemClassName =
  "grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 px-3 py-2 outline-none select-none data-highlighted:bg-gray-900 data-highlighted:text-white data-disabled:opacity-50";

export function Select({
  children,
  className,
  defaultValue,
  value,
  ...props
}: SelectProps) {
  const options = parseOptions(children);
  const placeholderOption = options.find((option) => option.value === "");
  const selectableOptions = options.filter((option) => option.value !== "");
  const items = selectableOptions.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  const rootDefaultValue =
    defaultValue === "" || defaultValue === undefined ? null : defaultValue;
  const rootValue = value === "" || value === undefined ? null : value;

  return (
    <BaseSelect.Root
      items={items}
      defaultValue={rootDefaultValue}
      value={rootValue}
      {...props}
    >
      <BaseSelect.Trigger
        className={mergeClassName(triggerClassName, className)}
        id={props.id}
      >
        <BaseSelect.Value
          className="truncate data-placeholder:text-gray-500"
          placeholder={placeholderOption?.label}
        />
        <BaseSelect.Icon className="shrink-0 text-gray-500">
          <ChevronUpDownIcon />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner className="outline-none select-none" sideOffset={4}>
          <BaseSelect.Popup className={popupClassName}>
            <BaseSelect.List className="max-h-[var(--available-height)] overflow-y-auto">
              {selectableOptions.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={itemClassName}
                >
                  <BaseSelect.ItemIndicator className="col-start-1">
                    <CheckIcon />
                  </BaseSelect.ItemIndicator>
                  <BaseSelect.ItemText className="col-start-2">
                    {option.label}
                  </BaseSelect.ItemText>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
