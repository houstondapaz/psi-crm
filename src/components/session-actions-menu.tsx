"use client";

import { useState } from "react";
import {
  cancelSessionAction,
  deleteSessionAction,
  rescheduleSessionAction,
} from "@/app/actions/domain";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EllipsisVerticalIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Menu } from "@/components/ui/menu";
import { t } from "@/lib/i18n";

type SessionActionsMenuProps = {
  sessionId: string;
  status: string;
  scheduledAt: string | null;
  occurredAt: string | null;
};

type DialogMode = "cancel" | "delete" | "reschedule" | null;

function toDatetimeLocalValue(isoDate: string | null) {
  if (!isoDate) {
    return "";
  }
  const date = new Date(isoDate);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

const destructiveButtonClassName =
  "rounded-sm bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:not-data-disabled:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 data-disabled:opacity-50";

export function SessionActionsMenu({
  sessionId,
  status,
  scheduledAt,
  occurredAt,
}: SessionActionsMenuProps) {
  const [dialog, setDialog] = useState<DialogMode>(null);
  const canCancel = status === "scheduled";
  const currentDate = status === "completed" ? occurredAt : scheduledAt;

  function closeDialog() {
    setDialog(null);
  }

  return (
    <>
      <Menu.Root>
        <Menu.Trigger
          type="button"
          aria-label={t("sessions.sessionActions")}
          className="inline-flex shrink-0 items-center justify-center rounded-sm p-2 text-gray-600 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
        >
          <EllipsisVerticalIcon />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner side="bottom" align="end">
            <Menu.Popup>
              {canCancel && (
                <Menu.Item onClick={() => setDialog("cancel")}>
                  {t("sessions.cancelSession")}
                </Menu.Item>
              )}
              <Menu.Item onClick={() => setDialog("reschedule")}>
                {t("sessions.changeSessionDate")}
              </Menu.Item>
              <Menu.Item
                className="text-red-700 data-highlighted:bg-red-50"
                onClick={() => setDialog("delete")}
              >
                {t("sessions.deleteSession")}
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>

      <Dialog.Root
        open={dialog === "cancel"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <div className="space-y-4 p-6">
              <div>
                <Dialog.Title>{t("sessions.cancelSession")}</Dialog.Title>
                <Dialog.Description>{t("sessions.cancelSessionConfirm")}</Dialog.Description>
              </div>
              <ActionForm
                action={cancelSessionAction}
                className="flex justify-end gap-2 pt-2"
                successMessage="toast.sessionCancelled"
                onSuccess={closeDialog}
              >
                <input type="hidden" name="sessionId" value={sessionId} />
                <Dialog.Close render={<Button variant="secondary" type="button" />}>
                  {t("common.cancel")}
                </Dialog.Close>
                <Button type="submit" className={destructiveButtonClassName}>
                  {t("sessions.cancelSession")}
                </Button>
              </ActionForm>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root
        open={dialog === "delete"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <div className="space-y-4 p-6">
              <div>
                <Dialog.Title>{t("sessions.deleteSession")}</Dialog.Title>
                <Dialog.Description>{t("sessions.deleteSessionConfirm")}</Dialog.Description>
              </div>
              <ActionForm
                action={deleteSessionAction}
                className="flex justify-end gap-2 pt-2"
                successMessage="toast.sessionDeleted"
              >
                <input type="hidden" name="sessionId" value={sessionId} />
                <Dialog.Close render={<Button variant="secondary" type="button" />}>
                  {t("common.cancel")}
                </Dialog.Close>
                <Button type="submit" className={destructiveButtonClassName}>
                  {t("common.delete")}
                </Button>
              </ActionForm>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root
        open={dialog === "reschedule"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <ActionForm
              key={currentDate ?? "empty"}
              action={rescheduleSessionAction}
              className="space-y-4 p-6"
              successMessage="toast.sessionRescheduled"
              onSuccess={closeDialog}
            >
              <div>
                <Dialog.Title>{t("sessions.changeSessionDate")}</Dialog.Title>
              </div>
              <input type="hidden" name="sessionId" value={sessionId} />
              <div>
                <Label htmlFor={`reschedule-${sessionId}`}>{t("common.datetime")}</Label>
                <Input
                  className="mt-1"
                  id={`reschedule-${sessionId}`}
                  name="scheduledAt"
                  type="datetime-local"
                  defaultValue={toDatetimeLocalValue(currentDate)}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Dialog.Close render={<Button variant="secondary" type="button" />}>
                  {t("common.cancel")}
                </Dialog.Close>
                <Button type="submit">{t("sessions.saveDate")}</Button>
              </div>
            </ActionForm>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
