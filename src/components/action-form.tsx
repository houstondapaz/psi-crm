"use client";

import { useActionState, useEffect, useRef } from "react";
import type { ActionState } from "@/lib/action-state";
import { initialActionState } from "@/lib/action-state";
import { FormError } from "@/components/ui/form-error";

type ActionFormProps = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className?: string;
  id?: string;
  onSuccess?: () => void;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

export function ActionForm({
  action,
  children,
  className,
  id,
  onSuccess,
  onSubmit,
}: ActionFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialActionState);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending && !state.error) {
      onSuccess?.();
    }
    wasPending.current = isPending;
  }, [isPending, state.error, onSuccess]);

  return (
    <form id={id} action={formAction} className={className} onSubmit={onSubmit}>
      <FormError message={state.error} />
      {children}
    </form>
  );
}
