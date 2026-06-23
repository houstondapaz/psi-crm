"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/action-state";
import { initialActionState } from "@/lib/action-state";
import type { MessageKey } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { useActionFeedback } from "@/lib/use-action-feedback";

type ActionFormProps = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className?: string;
  id?: string;
  onSuccess?: () => void;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  successMessage?: MessageKey;
  showSuccessToast?: boolean;
};

export function ActionForm({
  action,
  children,
  className,
  id,
  onSuccess,
  onSubmit,
  successMessage = "toast.saved",
  showSuccessToast = true,
}: ActionFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialActionState);

  useActionFeedback(state, isPending, {
    successMessage: showSuccessToast ? t(successMessage) : undefined,
    onSuccess,
  });

  return (
    <form id={id} action={formAction} className={className} onSubmit={onSubmit}>
      {children}
    </form>
  );
}
