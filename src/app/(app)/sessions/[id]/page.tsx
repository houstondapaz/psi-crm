import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addFileLinkAction,
  attachSessionLabelAction,
  createAndAttachSessionLabelAction,
  createAnnotationAction,
  createReferralAction,
  deleteReferralAction,
  detachSessionLabelAction,
  markSoldAction,
  updateSessionAction,
} from "@/app/actions/domain";
import { requireAuth } from "@/lib/auth/session";
import { getSessionById } from "@/services/session-service";
import { listProducts } from "@/services/product-service";
import { listLabels, listLabelsBySession } from "@/services/label-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AnnotationCard } from "@/components/annotation-card";
import { EtiquetaPicker } from "@/components/etiqueta-picker";
import { FileLinkCard } from "@/components/file-link-card";

function toDatetimeLocalValue(date: Date | null) {
  if (!date) {
    return "";
  }
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function formatRecordedAt(date: Date) {
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireAuth();
  const { id } = await params;
  const session = await getSessionById(auth, id);
  if (!session) {
    notFound();
  }

  const products = await listProducts(auth);
  const [attachedLabels, catalog] = await Promise.all([
    listLabelsBySession(auth, id),
    listLabels(auth),
  ]);

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <Link
          href="/sessions"
          className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          ← Sessões
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            <Link
              href={`/patients/${session.patientId}`}
              className="transition hover:text-gray-600"
            >
              {session.patientName}
            </Link>
          </h1>
          <Badge variant="default">{session.status}</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        <div className="space-y-8 lg:col-span-2">
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Anotações</h2>
            {session.annotations.map((annotation) => (
              <AnnotationCard
                key={annotation.id}
                sessionId={session.id}
                annotationId={annotation.id}
                content={annotation.content}
                recordedAtLabel={formatRecordedAt(annotation.recordedAt)}
                recordedAtValue={toDatetimeLocalValue(annotation.recordedAt)}
              />
            ))}
            <Card className="space-y-4">
              <h3 className="font-medium text-gray-900">Nova anotação</h3>
              <form action={createAnnotationAction} className="space-y-3">
                <input type="hidden" name="sessionId" value={session.id} />
                <Textarea
                  name="content"
                  placeholder="Escreva uma anotação clínica..."
                  className="min-h-24"
                  required
                />
                <Button type="submit">Adicionar anotação</Button>
              </form>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Links</h2>
            {session.fileLinks.map((link) => (
              <FileLinkCard
                key={link.id}
                sessionId={session.id}
                fileLinkId={link.id}
                label={link.label}
                url={link.url}
              />
            ))}
            <Card className="space-y-4">
              <h3 className="font-medium text-gray-900">Adicionar link</h3>
              <form action={addFileLinkAction} className="space-y-3">
                <input type="hidden" name="sessionId" value={session.id} />
                <Input name="label" placeholder="Rótulo" required />
                <Input name="url" placeholder="URL Google Drive" required />
                <Button type="submit">Adicionar link</Button>
              </form>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Indicações</h2>
            {session.referrals.map((referral) => (
              <Card key={referral.id}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-medium text-gray-900">
                    {referral.productName}
                  </span>
                  {referral.sold ? (
                    <Badge variant="success">Vendido</Badge>
                  ) : (
                    <>
                      <form action={markSoldAction}>
                        <input type="hidden" name="sessionId" value={session.id} />
                        <input
                          type="hidden"
                          name="referralId"
                          value={referral.id}
                        />
                        <Button variant="secondary" type="submit">
                          Marcar vendido
                        </Button>
                      </form>
                      <form action={deleteReferralAction}>
                        <input type="hidden" name="sessionId" value={session.id} />
                        <input
                          type="hidden"
                          name="referralId"
                          value={referral.id}
                        />
                        <Button variant="ghost" type="submit">
                          Excluir
                        </Button>
                      </form>
                    </>
                  )}
                </div>
              </Card>
            ))}
            {products.length > 0 && (
              <Card className="space-y-4">
                <h3 className="font-medium text-gray-900">Indicar produto</h3>
                <form action={createReferralAction} className="space-y-3">
                  <input type="hidden" name="sessionId" value={session.id} />
                  <input type="hidden" name="patientId" value={session.patientId} />
                  <Select name="productId" required>
                    <option value="">Selecione um produto...</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </Select>
                  <Button variant="secondary" type="submit">
                    Indicar
                  </Button>
                </form>
              </Card>
            )}
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6">
          <Card className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Etiquetas</h2>
            <EtiquetaPicker
              attached={attachedLabels}
              catalog={catalog}
              attachAction={attachSessionLabelAction}
              detachAction={detachSessionLabelAction}
              createAndAttachAction={createAndAttachSessionLabelAction}
              hiddenFields={{ sessionId: session.id }}
            />
          </Card>
          <Card className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Dados da sessão</h2>
            <form action={updateSessionAction} className="space-y-4">
              <input type="hidden" name="sessionId" value={session.id} />
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  className="mt-1"
                  id="status"
                  name="status"
                  defaultValue={session.status}
                >
                  <option value="scheduled">scheduled</option>
                  <option value="completed">completed</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="scheduledAt">Agendada para</Label>
                <Input
                  className="mt-1"
                  id="scheduledAt"
                  name="scheduledAt"
                  type="datetime-local"
                  defaultValue={toDatetimeLocalValue(session.scheduledAt)}
                />
              </div>
              <div>
                <Label htmlFor="occurredAt">Realizada em</Label>
                <Input
                  className="mt-1"
                  id="occurredAt"
                  name="occurredAt"
                  type="datetime-local"
                  defaultValue={toDatetimeLocalValue(session.occurredAt)}
                />
              </div>
              <Button type="submit" className="w-full">
                Salvar dados
              </Button>
            </form>
          </Card>
        </aside>
      </div>
    </main>
  );
}
