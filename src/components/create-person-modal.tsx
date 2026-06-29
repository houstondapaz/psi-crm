"use client";

import { useState } from "react";
import { createLeadAction, createPatientAction } from "@/app/actions/domain";
import { ActionForm } from "@/components/action-form";
import { AddressInput } from "@/components/address-input";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PatientStatus } from "@/lib/patient-status";
import { t } from "@/lib/i18n";

type CreatePersonModalProps = {
  status?: PatientStatus;
};

export function CreatePersonModal({ status = "patient" }: CreatePersonModalProps) {
  const isLead = status === "lead";
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
      <Dialog.Trigger render={<Button type="button" />}>
        {isLead ? t("leads.newLead") : t("patients.newPatient")}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <ActionForm
            key={formKey}
            action={isLead ? createLeadAction : createPatientAction}
            className="space-y-4 p-6"
            successMessage="toast.patientCreated"
            onSuccess={() => handleOpenChange(false)}
          >
            <div>
              <Dialog.Title>
                {isLead ? t("leads.newLead") : t("patients.newPatient")}
              </Dialog.Title>
            </div>

            <div>
              <Label htmlFor={`create-${status}-name`}>{t("common.name")}</Label>
              <Input
                className="mt-1"
                id={`create-${status}-name`}
                name="name"
                required
              />
            </div>

            <div>
              <Label htmlFor={`create-${status}-email`}>{t("common.email")}</Label>
              <Input
                className="mt-1"
                id={`create-${status}-email`}
                name="email"
                type="email"
              />
            </div>

            <div>
              <Label htmlFor={`create-${status}-phone`}>{t("common.phone")}</Label>
              <Input className="mt-1" id={`create-${status}-phone`} name="phone" />
            </div>

            <div>
              <Label htmlFor={`create-${status}-address`}>{t("common.address")}</Label>
              <div className="mt-1">
                <AddressInput id={`create-${status}-address`} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close render={<Button variant="secondary" type="button" />}>
                {t("common.cancel")}
              </Dialog.Close>
              <Button type="submit">{t("common.register")}</Button>
            </div>
          </ActionForm>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
