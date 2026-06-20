"use client";

import { createPatientAction } from "@/app/actions/domain";
import { ActionForm } from "@/components/action-form";
import { AddressInput } from "@/components/address-input";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { t } from "@/lib/i18n";

export function CreatePatientModal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button type="button" />}>
        {t("patients.newPatient")}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <ActionForm action={createPatientAction} className="space-y-4 p-6">
            <div>
              <Dialog.Title>{t("patients.newPatient")}</Dialog.Title>
            </div>

            <div>
              <Label htmlFor="create-patient-name">{t("common.name")}</Label>
              <Input
                className="mt-1"
                id="create-patient-name"
                name="name"
                required
              />
            </div>

            <div>
              <Label htmlFor="create-patient-email">{t("common.email")}</Label>
              <Input
                className="mt-1"
                id="create-patient-email"
                name="email"
                type="email"
              />
            </div>

            <div>
              <Label htmlFor="create-patient-phone">{t("common.phone")}</Label>
              <Input className="mt-1" id="create-patient-phone" name="phone" />
            </div>

            <div>
              <Label htmlFor="create-patient-address">{t("common.address")}</Label>
              <div className="mt-1">
                <AddressInput id="create-patient-address" />
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
