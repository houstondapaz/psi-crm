import Link from "next/link";
import { notFound } from "next/navigation";
import {
  attachPatientLabelAction,
  createAndAttachPatientLabelAction,
  createReminderAction,
  createSessionAction,
  detachPatientLabelAction,
  resolveReminderAction,
  scheduleSessionAction,
} from "@/app/actions/domain";
import { requireAuth } from "@/lib/auth/session";
import { getPatientById } from "@/services/patient-service";
import { listContactsByPatient, listRemindersByPatient } from "@/services/reminder-service";
import { listSessionsByPatient } from "@/services/session-service";
import { listLabels, listLabelsByPatient } from "@/services/label-service";
import { EtiquetaPicker } from "@/components/etiqueta-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function formatSessionDate(session: {
  status: string;
  scheduledAt: Date | null;
  occurredAt: Date | null;
}) {
  const date =
    session.status === "scheduled" ? session.scheduledAt : session.occurredAt;
  if (!date) {
    return "Sem data";
  }
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireAuth();
  const { id } = await params;
  const patient = await getPatientById(auth, id);
  if (!patient) {
    notFound();
  }

  const [sessions, contacts, reminders, attachedLabels, catalog] = await Promise.all([
    listSessionsByPatient(auth, id),
    listContactsByPatient(auth, id),
    listRemindersByPatient(auth, id),
    listLabelsByPatient(auth, id),
    listLabels(auth),
  ]);

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6">
      <div>
        <Link
          href="/patients"
          className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          ← Pacientes
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{patient.name}</h1>
      </div>

      <Card className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Etiquetas</h2>
        <EtiquetaPicker
          attached={attachedLabels}
          catalog={catalog}
          attachAction={attachPatientLabelAction}
          detachAction={detachPatientLabelAction}
          createAndAttachAction={createAndAttachPatientLabelAction}
          hiddenFields={{ patientId: id }}
        />
      </Card>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Nova sessão</h2>
          <form action={createSessionAction}>
            <input type="hidden" name="patientId" value={id} />
            <Button type="submit">Registrar sessão</Button>
          </form>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Agendar sessão</h2>
          <form action={scheduleSessionAction} className="space-y-4">
            <input type="hidden" name="patientId" value={id} />
            <div>
              <Label htmlFor="scheduledAt">Data e hora</Label>
              <Input
                className="mt-1"
                id="scheduledAt"
                name="scheduledAt"
                type="datetime-local"
                required
              />
            </div>
            <Button type="submit">Agendar</Button>
          </form>
        </Card>

        <Card className="space-y-4 lg:col-span-2">
          <h2 className="text-lg font-medium text-gray-900">Novo lembrete</h2>
          <form action={createReminderAction} className="grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="patientId" value={id} />
            <div>
              <Label htmlFor="targetDate">Data alvo</Label>
              <Input
                className="mt-1"
                id="targetDate"
                name="targetDate"
                type="date"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                className="mt-1"
                id="description"
                name="description"
                placeholder="Ex: retomar contato"
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Criar lembrete</Button>
            </div>
          </form>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium text-gray-900">Sessões</h2>
        {sessions.length === 0 && (
          <p className="text-sm text-gray-600">Nenhuma sessão registrada.</p>
        )}
        {sessions.map((session) => (
          <Card key={session.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-600">{formatSessionDate(session)}</p>
                <Badge variant="default">{session.status}</Badge>
              </div>
              <Link
                href={`/sessions/${session.id}`}
                className="inline-block rounded-sm border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Ver sessão
              </Link>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-gray-900">Lembretes</h2>
          {reminders.map((reminder) => (
            <Card key={reminder.id}>
              <p className="font-medium text-gray-900">
                {reminder.description ?? "Retomar contato"}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(reminder.targetDate).toISOString().slice(0, 10)} ·{" "}
                {reminder.status}
              </p>
              {reminder.status === "pending" && (
                <form action={resolveReminderAction} className="mt-3">
                  <input type="hidden" name="patientId" value={id} />
                  <input type="hidden" name="reminderId" value={reminder.id} />
                  <input type="hidden" name="type" value="whatsapp" />
                  <Button variant="secondary" type="submit">
                    Registrar contato
                  </Button>
                </form>
              )}
            </Card>
          ))}
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-gray-900">Contatos</h2>
          {contacts.map((contact) => (
            <Card key={contact.id}>
              <p className="font-medium capitalize text-gray-900">{contact.type}</p>
              <p className="text-sm text-gray-600">
                {contact.occurredAt.toLocaleString("pt-BR")}
              </p>
              {contact.description && (
                <p className="text-sm text-gray-700">{contact.description}</p>
              )}
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
