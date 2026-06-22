import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { listPatients } from "@/services/patient-service";
import { listAllSessions } from "@/services/session-service";
import { listLabels } from "@/services/label-service";
import { CreateSessionModal } from "@/components/create-session-modal";
import { SessionActionsMenu } from "@/components/session-actions-menu";
import { LabelChip } from "@/components/label-chip";
import { LabelFilter } from "@/components/label-filter";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { formatSessionDateTime, getSessionStatusLabel, t } from "@/lib/i18n";

function formatSessionDate(date: Date | null) {
  if (!date) {
    return t("common.noDate");
  }
  return formatSessionDateTime(date);
}

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ label?: string | string[] }>;
}) {
  const auth = await requireAuth();
  const params = await searchParams;
  const labelParam = params.label;
  const labelIds = Array.isArray(labelParam)
    ? labelParam
    : labelParam
      ? [labelParam]
      : [];
  const [sessions, patients, catalog] = await Promise.all([
    listAllSessions(auth, { labelIds }),
    listPatients(auth),
    listLabels(auth),
  ]);

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <PageHeader
        title={t("sessions.title")}
        description={t("sessions.description")}
        action={
          <CreateSessionModal
            patients={patients.map((patient) => ({
              id: patient.id,
              name: patient.name,
            }))}
          />
        }
      />
      <LabelFilter catalog={catalog} selectedIds={labelIds} basePath="/sessions" />
      <div className="space-y-2">
        {sessions.length === 0 && (
          <EmptyState message={t("sessions.empty")} />
        )}
        {sessions.map((session) => (
          <Card key={session.id} className="hover:border-gray-300">
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/sessions/${session.id}`}
                className="min-w-0 flex-1 transition hover:opacity-90"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-gray-900">{session.patientName}</p>
                  <Badge variant="default">{getSessionStatusLabel(session.status)}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {formatSessionDate(session.displayDate)}
                </p>
                {session.labels.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {session.labels.map((label) => (
                      <LabelChip
                        key={label.id}
                        name={label.name}
                        color={label.color}
                      />
                    ))}
                  </div>
                )}
              </Link>
              <SessionActionsMenu
                sessionId={session.id}
                status={session.status}
                scheduledAt={session.scheduledAt?.toISOString() ?? null}
                occurredAt={session.occurredAt?.toISOString() ?? null}
              />
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
