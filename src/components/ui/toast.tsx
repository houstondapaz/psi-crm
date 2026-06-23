"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { t } from "@/lib/i18n";

export const toastManager = BaseToast.createToastManager();

const viewportClassName =
  "fixed bottom-4 right-4 z-50 flex w-[min(100vw-2rem,24rem)] flex-col gap-2 outline-none";

const toastClassName =
  "pointer-events-auto rounded-lg border bg-white shadow-lg transition-[transform,opacity] duration-200 ease-out data-ending-style:opacity-0 data-starting-style:translate-y-2 data-starting-style:opacity-0 data-[type=error]:border-red-200 data-[type=success]:border-green-200 data-[type=error]:bg-red-50 data-[type=success]:bg-green-50 data-expanded:translate-y-[var(--toast-offset-y)]";

const contentClassName = "overflow-hidden transition-opacity duration-200 data-behind:opacity-0";

const titleClassName = "text-sm font-medium text-gray-900 data-[type=error]:text-red-900 data-[type=success]:text-green-900";

const descriptionClassName =
  "mt-0.5 text-sm text-gray-600 data-[type=error]:text-red-800 data-[type=success]:text-green-800";

const closeClassName =
  "shrink-0 rounded-sm px-2 py-1 text-xs font-medium text-gray-500 transition hover:bg-black/5 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2";

function ToastList() {
  const { toasts } = BaseToast.useToastManager();

  return toasts.map((toast) => (
    <BaseToast.Root key={toast.id} toast={toast} className={toastClassName}>
      <BaseToast.Content className={contentClassName}>
        <div className="flex items-start gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            {toast.title ? <BaseToast.Title className={titleClassName} /> : null}
            {toast.description ? (
              <BaseToast.Description className={descriptionClassName} />
            ) : null}
          </div>
          <BaseToast.Close className={closeClassName}>{t("toast.dismiss")}</BaseToast.Close>
        </div>
      </BaseToast.Content>
    </BaseToast.Root>
  ));
}

type ToastProviderProps = {
  children: React.ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <BaseToast.Provider toastManager={toastManager} timeout={5000} limit={3}>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport className={viewportClassName}>
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

export function showSuccessToast(message: string) {
  toastManager.add({
    type: "success",
    title: message,
    priority: "low",
  });
}

export function showErrorToast(message: string) {
  toastManager.add({
    type: "error",
    title: message,
    priority: "high",
  });
}
