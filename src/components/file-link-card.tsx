"use client";

import { useActionState } from "react";
import {
  deleteFileLinkAction,
  updateFileLinkAction,
} from "@/app/actions/domain";
import { initialActionState } from "@/lib/action-state";
import { Card } from "@/components/ui/card";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { t } from "@/lib/i18n";

type FileLinkCardProps = {
  sessionId: string;
  fileLinkId: string;
  label: string;
  url: string;
};

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 11.142A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-11.142.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const iconButtonClass =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2";

export function FileLinkCard({
  sessionId,
  fileLinkId,
  label,
  url,
}: FileLinkCardProps) {
  const [updateState, updateFormAction] = useActionState(
    updateFileLinkAction,
    initialActionState,
  );
  const [deleteState, deleteFormAction] = useActionState(
    deleteFileLinkAction,
    initialActionState,
  );
  const error = updateState.error ?? deleteState.error;

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <form
          action={updateFormAction}
          className="grid flex-1 gap-3 sm:grid-cols-[1fr_2fr_auto]"
        >
          <FormError message={error} />
          <input type="hidden" name="sessionId" value={sessionId} />
          <input type="hidden" name="fileLinkId" value={fileLinkId} />
          <Input name="label" defaultValue={label} required />
          <Input name="url" defaultValue={url} required />
          <button
            type="submit"
            className={iconButtonClass}
            aria-label={t("sessions.saveLink")}
          >
            <CheckIcon />
          </button>
        </form>
        <form action={deleteFormAction}>
          <input type="hidden" name="sessionId" value={sessionId} />
          <input type="hidden" name="fileLinkId" value={fileLinkId} />
          <button
            type="submit"
            className={`${iconButtonClass} hover:border-red-200 hover:bg-red-50 hover:text-red-700`}
            aria-label={t("sessions.deleteLink")}
          >
            <TrashIcon />
          </button>
        </form>
      </div>
    </Card>
  );
}
