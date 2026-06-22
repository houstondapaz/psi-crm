"use client";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import { mergeClassName } from "@/lib/cn";

const popupClassName =
  "min-w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-lg outline-none";

const itemClassName =
  "flex cursor-default select-none rounded-sm px-3 py-2 text-sm text-gray-700 outline-none data-highlighted:bg-gray-100 data-disabled:pointer-events-none data-disabled:opacity-50";

function MenuPopup({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Popup>) {
  return <BaseMenu.Popup className={mergeClassName(popupClassName, className)} {...props} />;
}

function MenuItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Item>) {
  return <BaseMenu.Item className={mergeClassName(itemClassName, className)} {...props} />;
}

export const Menu = {
  Root: BaseMenu.Root,
  Trigger: BaseMenu.Trigger,
  Portal: BaseMenu.Portal,
  Positioner: BaseMenu.Positioner,
  Popup: MenuPopup,
  Item: MenuItem,
};
