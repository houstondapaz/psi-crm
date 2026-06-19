"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/action-state";
import { initialActionState } from "@/lib/action-state";
import { FormError } from "@/components/ui/form-error";

type ActionFormProps = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export function ActionForm({ action, children, className, id }: ActionFormProps) {
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form id={id} action={formAction} className={className}>
      <FormError message={state.error} />
      {children}
    </form>
  );
}
