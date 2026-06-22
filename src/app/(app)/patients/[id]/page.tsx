import Link from "next/link";
import { notFound } from "next/navigation";
import {
  attachPatientLabelAction,
  createAndAttachPatientLabelAction,
  detachPatientLabelAction,
  resolveReminderAction,
  updatePatientAction,
} from "@/app/actions/domain";
import { requireAuth } from "@/lib/auth/session";
import { getPatientById } from "@/services/patient-service";
import { listContactsByPatient, listRemindersByPatient } from "@/services/reminder-service";
import { listSessionsByPatient } from "@/services/session-service";
import { listLabels, listLabelsByPatient } from "@/services/label-service";
import { EtiquetaPicker } from "@/components/etiqueta-picker";
import { DeletePatientForm } from "@/components/delete-patient-form";
import { AddressInput } from "@/components/address-input";
import { ActionForm } from "@/components/action-form";
import { CreateReminderModal } from "@/components/create-reminder-modal";
import { CreateSessionModal } from "@/components/create-session-modal";
import { LabelFilter } from "@/components/label-filter";
import { SessionList } from "@/components/session-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatSessionDateTime, t } from "@/lib/i18n";

export default async function PatientDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ label?: string | string[] }>;
}) {
  const auth = await requireAuth();
  const { id } = await params;
  const labelParams = await searchParams;
  const labelParam = labelParams.label;
  const labelIds = Array.isArray(labelParam)
    ? labelParam
    : labelParam
      ? [labelParam]
      : [];
  const patient = await getPatientById(auth, id);
  if (!patient) {
    notFound();
  }

  const [sessions, contacts, reminders, attachedLabels, catalog] = await Promise.all([
    listSessionsByPatient(auth, id, { labelIds }),
    listContactsByPatient(auth, id),
    listRemindersByPatient(auth, id),
    listLabelsByPatient(auth, id),
    listLabels(auth),
  ]);

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6">
      <div>
        <Link
          href="/patients"
          className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          {t("common.backToPatients")}
        </Link>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
          <div className="flex flex-wrap gap-2">
            <CreateSessionModal
              patients={[{ id, name: patient.name }]}
              defaultPatientId={id}
            />
            <CreateReminderModal patientId={id} />
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-gray-900">{t("patients.sessions")}</h2>
            <LabelFilter
              catalog={catalog}
              selectedIds={labelIds}
              basePath={`/patients/${id}`}
            />
            <SessionList sessions={sessions} emptyMessage={t("patients.noSessions")} />
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <h2 className="text-lg font-medium text-gray-900">{t("patients.reminders")}</h2>
              {reminders.map((reminder) => (
                <Card key={reminder.id}>
                  <p className="font-medium text-gray-900">
                    {reminder.description ?? t("common.defaultReminder")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(reminder.targetDate).toISOString().slice(0, 10)} ·{" "}
                    {reminder.status}
                  </p>
                  {reminder.status === "pending" && (
                    <ActionForm action={resolveReminderAction} className="mt-3">
                      <input type="hidden" name="patientId" value={id} />
                      <input type="hidden" name="reminderId" value={reminder.id} />
                      <input type="hidden" name="type" value="whatsapp" />
                      <Button variant="secondary" type="submit">
                        {t("patients.registerContact")}
                      </Button>
                    </ActionForm>
                  )}
                </Card>
              ))}
            </div>
            <div className="space-y-3">
              <h2 className="text-lg font-medium text-gray-900">{t("patients.contacts")}</h2>
              {contacts.map((contact) => (
                <Card key={contact.id}>
                  <p className="font-medium capitalize text-gray-900">{contact.type}</p>
                  <p className="text-sm text-gray-600">
                    {formatSessionDateTime(contact.occurredAt)}
                  </p>
                  {contact.description && (
                    <p className="text-sm text-gray-700">{contact.description}</p>
                  )}
                </Card>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:col-span-1">
          <Card className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">{t("patients.patientData")}</h2>
            <ActionForm action={updatePatientAction} className="space-y-4">
              <input type="hidden" name="patientId" value={id} />
              <div>
                <Label htmlFor="name">{t("common.name")}</Label>
                <Input
                  className="mt-1"
                  id="name"
                  name="name"
                  defaultValue={patient.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">{t("common.email")}</Label>
                <Input
                  className="mt-1"
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={patient.email ?? ""}
                />
              </div>
              <div>
                <Label htmlFor="phone">{t("common.phone")}</Label>
                <Input
                  className="mt-1"
                  id="phone"
                  name="phone"
                  defaultValue={patient.phone ?? ""}
                />
              </div>
              <div>
                <Label htmlFor="address">{t("common.address")}</Label>
                <div className="mt-1">
                  <AddressInput id="address" defaultValue={patient.address ?? ""} />
                </div>
              </div>
              <Button type="submit">{t("common.save")}</Button>
            </ActionForm>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">{t("patients.labels")}</h2>
            <EtiquetaPicker
              attached={attachedLabels}
              catalog={catalog}
              attachAction={attachPatientLabelAction}
              detachAction={detachPatientLabelAction}
              createAndAttachAction={createAndAttachPatientLabelAction}
              hiddenFields={{ patientId: id }}
            />
          </Card>

          <DeletePatientForm patientId={id} />
        </aside>
      </div>
    </main>
  );
}
