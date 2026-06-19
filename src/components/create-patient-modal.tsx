"use client";

import { useRef } from "react";
import { createPatientAction } from "@/app/actions/domain";
import { ActionForm } from "@/components/action-form";
import { AddressInput } from "@/components/address-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { t } from "@/lib/i18n";

export function CreatePatientModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openModal() {
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  return (
    <>
      <Button type="button" onClick={openModal}>
        {t("patients.newPatient")}
      </Button>

      <dialog
        ref={dialogRef}
        className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-0 shadow-xl backdrop:bg-black/40"
        onClose={closeModal}
      >
        <ActionForm action={createPatientAction} className="space-y-4 p-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{t("patients.newPatient")}</h2>
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
            <Button variant="secondary" type="button" onClick={closeModal}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">{t("common.register")}</Button>
          </div>
        </ActionForm>
      </dialog>
    </>
  );
}
