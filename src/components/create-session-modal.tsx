"use client";

import { useRef } from "react";
import { scheduleSessionAction } from "@/app/actions/domain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { t } from "@/lib/i18n";

type PatientOption = {
  id: string;
  name: string;
};

type CreateSessionModalProps = {
  patients: PatientOption[];
};

export function CreateSessionModal({ patients }: CreateSessionModalProps) {
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
        {t("sessions.newSession")}
      </Button>

      <dialog
        ref={dialogRef}
        className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-0 shadow-xl backdrop:bg-black/40"
        onClose={closeModal}
      >
        <form action={scheduleSessionAction} className="space-y-4 p-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{t("sessions.newSession")}</h2>
            <p className="mt-1 text-sm text-gray-600">
              {t("sessions.newSessionDescription")}
            </p>
          </div>

          <div>
            <Label htmlFor="create-session-patient">{t("sessions.patient")}</Label>
            <Select
              className="mt-1"
              id="create-session-patient"
              name="patientId"
              required
              defaultValue=""
            >
              <option value="" disabled>
                {t("common.selectPatient")}
              </option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="create-session-date">{t("common.datetime")}</Label>
            <Input
              className="mt-1"
              id="create-session-date"
              name="scheduledAt"
              type="datetime-local"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={closeModal}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">{t("sessions.createSession")}</Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
