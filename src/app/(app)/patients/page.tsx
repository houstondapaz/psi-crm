import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { listPatients } from "@/services/patient-service";
import { listLabels } from "@/services/label-service";
import { CreatePatientModal } from "@/components/create-patient-modal";
import { DeletePatientForm } from "@/components/delete-patient-form";
import { LabelChip } from "@/components/label-chip";
import { LabelFilter } from "@/components/label-filter";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { t } from "@/lib/i18n";

export default async function PatientsPage({
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
  const [patients, catalog] = await Promise.all([
    listPatients(auth, { labelIds }),
    listLabels(auth),
  ]);

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <PageHeader
        title={t("patients.title")}
        description={t("patients.registeredCount", { count: patients.length })}
        action={<CreatePatientModal />}
      />
      <LabelFilter catalog={catalog} selectedIds={labelIds} basePath="/patients" />
      <div className="space-y-2">
        {patients.map((patient) => (
          <Card key={patient.id} className="hover:border-gray-300">
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/patients/${patient.id}`}
                className="min-w-0 flex-1 transition hover:opacity-90"
              >
                <p className="font-medium text-gray-900">{patient.name}</p>
                <p className="text-sm text-gray-600">
                  {patient.description ?? t("patients.noDescription")}
                </p>
                {patient.labels.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {patient.labels.map((label) => (
                      <LabelChip
                        key={label.id}
                        name={label.name}
                        color={label.color}
                      />
                    ))}
                  </div>
                )}
              </Link>
              <DeletePatientForm patientId={patient.id} compact />
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
