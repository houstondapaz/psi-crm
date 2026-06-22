import { requireAuth } from "@/lib/auth/session";
import { listPatients } from "@/services/patient-service";
import { listAllSessions } from "@/services/session-service";
import { listLabels } from "@/services/label-service";
import { CreateSessionModal } from "@/components/create-session-modal";
import { LabelFilter } from "@/components/label-filter";
import { SessionList } from "@/components/session-list";
import { PageHeader } from "@/components/ui/page-header";
import { t } from "@/lib/i18n";

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
      <SessionList sessions={sessions} />
    </main>
  );
}
