import { requireAuth } from "@/lib/auth/session";
import { listLabels } from "@/services/label-service";
import {
  createLabelAction,
  deleteLabelAction,
  updateLabelAction,
} from "@/app/actions/domain";
import { ActionForm } from "@/components/action-form";
import { LabelChip } from "@/components/label-chip";
import { LabelColorSelect } from "@/components/label-color-select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { t } from "@/lib/i18n";

export default async function LabelsPage() {
  const auth = await requireAuth();
  const labels = await listLabels(auth);

  return (
    <main className="mx-auto grid max-w-5xl gap-6 p-4 sm:p-6 lg:grid-cols-2">
      <section className="space-y-4">
        <PageHeader
          title={t("labels.title")}
          description={t("labels.description")}
        />
        <div className="space-y-3">
          {labels.map((label) => (
            <Card key={label.id} className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <LabelChip name={label.name} color={label.color} />
                <ActionForm action={deleteLabelAction} successMessage="toast.labelDeleted">
                  <input type="hidden" name="labelId" value={label.id} />
                  <Button type="submit" variant="ghost">
                    {t("common.delete")}
                  </Button>
                </ActionForm>
              </div>
              <ActionForm action={updateLabelAction} className="space-y-3" successMessage="toast.labelSaved">
                <input type="hidden" name="labelId" value={label.id} />
                <div>
                  <Label htmlFor={`name-${label.id}`}>{t("common.name")}</Label>
                  <Input
                    className="mt-1"
                    id={`name-${label.id}`}
                    name="name"
                    defaultValue={label.name}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`color-${label.id}`}>{t("common.color")}</Label>
                  <LabelColorSelect
                    id={`color-${label.id}`}
                    defaultValue={label.color}
                  />
                </div>
                <Button type="submit" variant="secondary">
                  {t("common.save")}
                </Button>
              </ActionForm>
            </Card>
          ))}
        </div>
      </section>
      <section>
        <Card className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">{t("labels.newLabel")}</h2>
          <ActionForm action={createLabelAction} className="space-y-4" successMessage="toast.created">
            <div>
              <Label htmlFor="name">{t("common.name")}</Label>
              <Input className="mt-1" id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="color">{t("common.color")}</Label>
              <LabelColorSelect id="color" defaultValue="blue" />
            </div>
            <Button type="submit">{t("common.add")}</Button>
          </ActionForm>
        </Card>
      </section>
    </main>
  );
}
