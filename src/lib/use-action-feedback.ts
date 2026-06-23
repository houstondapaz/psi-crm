"use client";

import { useEffect, useRef } from "react";
import type { ActionState } from "@/lib/action-state";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";

type UseActionFeedbackOptions = {
  successMessage?: string;
  onSuccess?: () => void;
};

export function useActionFeedback(
  state: ActionState,
  isPending: boolean,
  options?: UseActionFeedbackOptions,
) {
  const wasPending = useRef(false);
  const { successMessage, onSuccess } = options ?? {};

  useEffect(() => {
    if (wasPending.current && !isPending) {
      if (state.error) {
        showErrorToast(state.error);
      } else {
        if (successMessage) {
          showSuccessToast(successMessage);
        }
        onSuccess?.();
      }
    }

    wasPending.current = isPending;
  }, [isPending, state.error, successMessage, onSuccess]);
}
