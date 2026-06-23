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
import { ActionForm } from "@/components/action-form";
import { EtiquetaPicker } from "@/components/etiqueta-picker";
import { FileLinkCard } from "@/components/file-link-card";
import { formatSessionDateTime, t , getSessionStatusLabel } from "@/lib/i18n";

function toDatetimeLocalValue(date: Date | null) {
  if (!date) {
    return "";
  }
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
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
          {t("common.backToSessions")}
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
          <Badge variant="default">{getSessionStatusLabel(session.status)}</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        <div className="space-y-8 lg:col-span-2">
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">{t("sessions.annotations")}</h2>
            {session.annotations.map((annotation) => (
              <AnnotationCard
                key={annotation.id}
                sessionId={session.id}
                annotationId={annotation.id}
                content={annotation.content}
                recordedAtLabel={formatSessionDateTime(annotation.recordedAt)}
                recordedAtValue={toDatetimeLocalValue(annotation.recordedAt)}
              />
            ))}
            <Card className="space-y-4">
              <h3 className="font-medium text-gray-900">{t("sessions.newAnnotation")}</h3>
              <ActionForm action={createAnnotationAction} className="space-y-3" successMessage="toast.created">
                <input type="hidden" name="sessionId" value={session.id} />
                <Textarea
                  name="content"
                  placeholder={t("sessions.annotationPlaceholder")}
                  className="min-h-24"
                  required
                />
                <Button type="submit">{t("sessions.addAnnotation")}</Button>
              </ActionForm>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">{t("sessions.links")}</h2>
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
              <h3 className="font-medium text-gray-900">{t("sessions.addLink")}</h3>
              <ActionForm action={addFileLinkAction} className="space-y-3" successMessage="toast.created">
                <input type="hidden" name="sessionId" value={session.id} />
                <Input name="label" placeholder={t("sessions.linkLabel")} required />
                <Input name="url" placeholder={t("sessions.linkUrl")} required />
                <Button type="submit">{t("sessions.addLink")}</Button>
              </ActionForm>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">{t("sessions.referrals")}</h2>
            {session.referrals.map((referral) => (
              <Card key={referral.id}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-medium text-gray-900">
                    {referral.productName}
                  </span>
                  {referral.sold ? (
                    <Badge variant="success">{t("sessions.sold")}</Badge>
                  ) : (
                    <>
                      <ActionForm action={markSoldAction} successMessage="toast.referralSold">
                        <input type="hidden" name="sessionId" value={session.id} />
                        <input
                          type="hidden"
                          name="referralId"
                          value={referral.id}
                        />
                        <Button variant="secondary" type="submit">
                          {t("sessions.markSold")}
                        </Button>
                      </ActionForm>
                      <ActionForm action={deleteReferralAction} successMessage="toast.referralDeleted">
                        <input type="hidden" name="sessionId" value={session.id} />
                        <input
                          type="hidden"
                          name="referralId"
                          value={referral.id}
                        />
                        <Button variant="ghost" type="submit">
                          {t("common.delete")}
                        </Button>
                      </ActionForm>
                    </>
                  )}
                </div>
              </Card>
            ))}
            {products.length > 0 && (
              <Card className="space-y-4">
                <h3 className="font-medium text-gray-900">{t("sessions.referProduct")}</h3>
                <ActionForm action={createReferralAction} className="space-y-3" successMessage="toast.referralCreated">
                  <input type="hidden" name="sessionId" value={session.id} />
                  <input type="hidden" name="patientId" value={session.patientId} />
                  <Select name="productId" required>
                    <option value="">{t("common.selectProduct")}</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </Select>
                  <Button variant="secondary" type="submit">
                    {t("sessions.refer")}
                  </Button>
                </ActionForm>
              </Card>
            )}
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6">
          <Card className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">{t("patients.labels")}</h2>
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
            <h2 className="text-lg font-medium text-gray-900">{t("sessions.sessionData")}</h2>
            <ActionForm
              key={`${session.status}-${session.scheduledAt?.toISOString() ?? ""}-${session.occurredAt?.toISOString() ?? ""}`}
              action={updateSessionAction}
              className="space-y-4"
              successMessage="toast.sessionSaved"
            >
              <input type="hidden" name="sessionId" value={session.id} />
              <div>
                <Label htmlFor="status">{t("common.status")}</Label>
                <Select
                  className="mt-1"
                  id="status"
                  name="status"
                  defaultValue={session.status}
                >
                  <option value="scheduled">{t("sessions.statusScheduled")}</option>
                  <option value="completed">{t("sessions.statusCompleted")}</option>
                  <option value="cancelled">{t("sessions.statusCancelled")}</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="scheduledAt">{t("sessions.scheduledFor")}</Label>
                <Input
                  className="mt-1"
                  id="scheduledAt"
                  name="scheduledAt"
                  type="datetime-local"
                  defaultValue={toDatetimeLocalValue(session.scheduledAt)}
                />
              </div>
              <div>
                <Label htmlFor="occurredAt">{t("sessions.occurredAt")}</Label>
                <Input
                  className="mt-1"
                  id="occurredAt"
                  name="occurredAt"
                  type="datetime-local"
                  defaultValue={toDatetimeLocalValue(session.occurredAt)}
                />
              </div>
              <Button type="submit" className="w-full">
                {t("sessions.saveData")}
              </Button>
            </ActionForm>
          </Card>
        </aside>
      </div>
    </main>
  );
}
