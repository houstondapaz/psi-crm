import { requireAuth } from "@/lib/auth/session";
import { listPatients } from "@/services/patient-service";
import { listLabels } from "@/services/label-service";
import { CreatePersonModal } from "@/components/create-person-modal";
import { LabelFilter } from "@/components/label-filter";
import { PatientRoster } from "@/components/patient-roster";
import { PageHeader } from "@/components/ui/page-header";
import { t } from "@/lib/i18n";

export default async function LeadsPage({
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
  const [leads, catalog] = await Promise.all([
    listPatients(auth, { labelIds, status: "lead" }),
    listLabels(auth),
  ]);

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <PageHeader
        title={t("leads.title")}
        description={t("leads.registeredCount", { count: leads.length })}
        action={<CreatePersonModal status="lead" />}
      />
      <LabelFilter catalog={catalog} selectedIds={labelIds} basePath="/leads" />
      <PatientRoster patients={leads} basePath="/leads" />
    </main>
  );
}
