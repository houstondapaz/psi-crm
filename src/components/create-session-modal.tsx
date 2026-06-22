"use client";

import { scheduleSessionAction } from "@/app/actions/domain";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { t } from "@/lib/i18n";

type PatientOption = {
  id: string;
  name: string;
};

type CreateSessionModalProps = {
  patients: PatientOption[];
};

export function CreateSessionModal({ patients }: CreateSessionModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button type="button" />}>
        {t("sessions.newSession")}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <ActionForm action={scheduleSessionAction} className="space-y-4 p-6">
            <div>
              <Dialog.Title>{t("sessions.newSession")}</Dialog.Title>
              <Dialog.Description>
                {t("sessions.newSessionDescription")}
              </Dialog.Description>
            </div>

            <div>
              <Label htmlFor="create-session-patient">{t("sessions.patient")}</Label>
              <NativeSelect
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
              </NativeSelect>
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
              <Dialog.Close render={<Button variant="secondary" type="button" />}>
                {t("common.cancel")}
              </Dialog.Close>
              <Button type="submit">{t("sessions.createSession")}</Button>
            </div>
          </ActionForm>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
