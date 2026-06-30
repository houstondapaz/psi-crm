import { requireAuth } from "@/lib/auth/session";
import { listLabels } from "@/services/label-service";
import { LabelCatalog } from "@/components/label-catalog";
import { PageHeader } from "@/components/ui/page-header";
import { t } from "@/lib/i18n";

export default async function LabelsPage() {
  const auth = await requireAuth();
  const labels = await listLabels(auth);

  return (
    <main className="mx-auto max-w-md space-y-4 p-4 sm:p-6">
      <PageHeader
        title={t("labels.title")}
        description={t("labels.description")}
      />
      <LabelCatalog labels={labels} />
    </main>
  );
}
