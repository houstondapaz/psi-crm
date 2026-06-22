"use client";

import { useState } from "react";
import { deletePatientAction } from "@/app/actions/domain";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TrashIcon } from "@/components/ui/icons";
import { t } from "@/lib/i18n";

type DeletePatientFormProps = {
  patientId: string;
  compact?: boolean;
};

export function DeletePatientForm({ patientId, compact = false }: DeletePatientFormProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        aria-label={t("patients.deletePatient")}
        className={
          compact
            ? "shrink-0 px-2.5 text-red-700 hover:bg-red-50"
            : "w-full text-red-700 hover:bg-red-50"
        }
        onClick={() => setOpen(true)}
      >
        {compact ? <TrashIcon /> : t("patients.deletePatient")}
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <div className="space-y-4 p-6">
              <div>
                <Dialog.Title>{t("patients.deletePatient")}</Dialog.Title>
                <Dialog.Description>{t("patients.deleteConfirm")}</Dialog.Description>
              </div>

              <ActionForm
                action={deletePatientAction}
                className="flex justify-end gap-2 pt-2"
              >
                <input type="hidden" name="patientId" value={patientId} />
                <Dialog.Close render={<Button variant="secondary" type="button" />}>
                  {t("common.cancel")}
                </Dialog.Close>
                <Button
                  type="submit"
                  className="rounded-sm bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:not-data-disabled:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 data-disabled:opacity-50"
                >
                  {t("common.delete")}
                </Button>
              </ActionForm>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
