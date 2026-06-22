"use client";

import { useState } from "react";
import { createReminderAction } from "@/app/actions/domain";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { t } from "@/lib/i18n";

type CreateReminderModalProps = {
  patientId: string;
};

export function CreateReminderModal({ patientId }: CreateReminderModalProps) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setFormKey((key) => key + 1);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger render={<Button type="button" variant="secondary" />}>
        {t("patients.newReminder")}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <ActionForm
            key={formKey}
            action={createReminderAction}
            className="space-y-4 p-6"
            onSuccess={() => handleOpenChange(false)}
          >
            <input type="hidden" name="patientId" value={patientId} />

            <div>
              <Dialog.Title>{t("patients.newReminder")}</Dialog.Title>
            </div>

            <div>
              <Label htmlFor="create-reminder-target-date">{t("common.targetDate")}</Label>
              <Input
                className="mt-1"
                id="create-reminder-target-date"
                name="targetDate"
                type="date"
                required
              />
            </div>

            <div>
              <Label htmlFor="create-reminder-description">{t("common.description")}</Label>
              <Input
                className="mt-1"
                id="create-reminder-description"
                name="description"
                placeholder={t("patients.reminderPlaceholder")}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close render={<Button variant="secondary" type="button" />}>
                {t("common.cancel")}
              </Dialog.Close>
              <Button type="submit">{t("patients.createReminder")}</Button>
            </div>
          </ActionForm>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
