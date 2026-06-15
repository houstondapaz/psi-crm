import Link from "next/link";
import { createPatientAction } from "@/app/actions/domain";
import { requireAuth } from "@/lib/auth/session";
import { listPatients } from "@/services/patient-service";
import { listLabels } from "@/services/label-service";
import { LabelChip } from "@/components/label-chip";
import { LabelFilter } from "@/components/label-filter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";

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
    <main className="mx-auto grid max-w-5xl gap-6 p-4 sm:p-6 lg:grid-cols-2">
      <section className="space-y-4">
        <PageHeader
          title="Pacientes"
          description={`${patients.length} cadastrados`}
        />
        <LabelFilter catalog={catalog} selectedIds={labelIds} basePath="/patients" />
        <div className="space-y-2">
          {patients.map((patient) => (
            <Link
              key={patient.id}
              href={`/patients/${patient.id}`}
              className="block transition hover:opacity-90"
            >
              <Card className="hover:border-gray-300">
                <p className="font-medium text-gray-900">{patient.name}</p>
                <p className="text-sm text-gray-600">
                  {patient.email ?? patient.phone ?? "Sem contato"}
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
              </Card>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <Card className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Novo paciente</h2>
          <form action={createPatientAction} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input className="mt-1" id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input className="mt-1" id="email" name="email" type="email" />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input className="mt-1" id="phone" name="phone" />
            </div>
            <Button type="submit">Cadastrar</Button>
          </form>
        </Card>
      </section>
    </main>
  );
}
