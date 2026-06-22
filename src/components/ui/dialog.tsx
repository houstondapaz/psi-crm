"use client";

import { useState } from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { mergeClassName } from "@/lib/cn";
import { PopupContainerProvider } from "@/components/ui/popup-container-context";

const backdropClassName =
  "fixed inset-0 min-h-dvh bg-black/40 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute";

const popupClassName =
  "fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-white p-0 shadow-xl transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0";

function DialogBackdrop({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Backdrop>) {
  return (
    <BaseDialog.Backdrop
      className={mergeClassName(backdropClassName, className)}
      {...props}
    />
  );
}

function DialogPopup({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Popup>) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  return (
    <PopupContainerProvider value={container}>
      <BaseDialog.Popup
        ref={setContainer}
        className={mergeClassName(popupClassName, className)}
        {...props}
      />
    </PopupContainerProvider>
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      className={mergeClassName("text-lg font-semibold text-gray-900", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description
      className={mergeClassName("mt-1 text-sm text-gray-600", className)}
      {...props}
    />
  );
}

export const Dialog = {
  Root: BaseDialog.Root,
  Trigger: BaseDialog.Trigger,
  Portal: BaseDialog.Portal,
  Backdrop: DialogBackdrop,
  Popup: DialogPopup,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: BaseDialog.Close,
};
