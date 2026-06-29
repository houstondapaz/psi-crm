"use client";

import { useState } from "react";
import { promotePatientAction } from "@/app/actions/domain";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { t } from "@/lib/i18n";

type PromotePatientFormProps = {
  patientId: string;
  patientName: string;
};

export function PromotePatientForm({ patientId, patientName }: PromotePatientFormProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        {t("leads.promoteToPatient")}
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <div className="space-y-4 p-6">
              <div>
                <Dialog.Title>{t("leads.promoteToPatient")}</Dialog.Title>
                <Dialog.Description>
                  {t("leads.promoteConfirm", { name: patientName })}
                </Dialog.Description>
              </div>

              <ActionForm
                action={promotePatientAction}
                className="flex justify-end gap-2 pt-2"
                successMessage="toast.patientPromoted"
              >
                <input type="hidden" name="patientId" value={patientId} />
                <Dialog.Close render={<Button variant="secondary" type="button" />}>
                  {t("common.cancel")}
                </Dialog.Close>
                <Button type="submit">{t("leads.promoteToPatient")}</Button>
              </ActionForm>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
