import Link from "next/link";
import type { PatientListItem } from "@/services/patient-service";
import { DeletePatientForm } from "@/components/delete-patient-form";
import { LabelChip } from "@/components/label-chip";
import { Card } from "@/components/ui/card";
import { t } from "@/lib/i18n";

type PatientRosterProps = {
  patients: PatientListItem[];
  basePath: "/patients" | "/leads";
};

export function PatientRoster({ patients, basePath }: PatientRosterProps) {
  return (
    <div className="space-y-2">
      {patients.map((patient) => (
        <Card key={patient.id} className="hover:border-gray-300">
          <div className="flex items-start justify-between gap-3">
            <Link
              href={`${basePath}/${patient.id}`}
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
  );
}
