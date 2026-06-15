import { requireAuth } from "@/lib/auth/session";
import { listLabels } from "@/services/label-service";
import { LABEL_COLORS } from "@/lib/label-colors";
import {
  createLabelAction,
  deleteLabelAction,
  updateLabelAction,
} from "@/app/actions/domain";
import { LabelChip } from "@/components/label-chip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";

export default async function LabelsPage() {
  const auth = await requireAuth();
  const labels = await listLabels(auth);

  return (
    <main className="mx-auto grid max-w-5xl gap-6 p-4 sm:p-6 lg:grid-cols-2">
      <section className="space-y-4">
        <PageHeader
          title="Etiquetas"
          description="Catálogo central do consultório para classificar pacientes e sessões"
        />
        <div className="space-y-3">
          {labels.map((label) => (
            <Card key={label.id} className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <LabelChip name={label.name} color={label.color} />
                <form action={deleteLabelAction}>
                  <input type="hidden" name="labelId" value={label.id} />
                  <Button type="submit" variant="ghost">
                    Excluir
                  </Button>
                </form>
              </div>
              <form action={updateLabelAction} className="space-y-3">
                <input type="hidden" name="labelId" value={label.id} />
                <div>
                  <Label htmlFor={`name-${label.id}`}>Nome</Label>
                  <Input
                    className="mt-1"
                    id={`name-${label.id}`}
                    name="name"
                    defaultValue={label.name}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`color-${label.id}`}>Cor</Label>
                  <select
                    id={`color-${label.id}`}
                    name="color"
                    defaultValue={label.color}
                    className="mt-1 block w-full rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900"
                  >
                    {LABEL_COLORS.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit" variant="secondary">
                  Salvar
                </Button>
              </form>
            </Card>
          ))}
        </div>
      </section>
      <section>
        <Card className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Nova etiqueta</h2>
          <form action={createLabelAction} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input className="mt-1" id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="color">Cor</Label>
              <select
                id="color"
                name="color"
                defaultValue="blue"
                className="mt-1 block w-full rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900"
              >
                {LABEL_COLORS.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit">Adicionar</Button>
          </form>
        </Card>
      </section>
    </main>
  );
}
