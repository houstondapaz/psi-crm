"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { DEFAULT_LABEL_COLOR, type LabelColor } from "@/lib/label-colors";
import { t } from "@/lib/i18n";
import { LabelChip } from "@/components/label-chip";
import { LabelEditorForm } from "@/components/label-editor-form";
import { LabelListRow } from "@/components/label-list-row";
import { Dialog } from "@/components/ui/dialog";
import { PencilSquareIcon, XMarkIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
  filterLabelsByQuery,
  INITIAL_VISIBLE_LABELS,
  LABEL_LIST_FOOTER_BUTTON_CLASS,
  LOAD_MORE_LABELS_STEP,
  normalizeLabelQuery,
  type LabelListItem,
} from "@/lib/label-list-utils";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";

export type EtiquetaOption = LabelListItem;

type EtiquetaPickerProps = {
  attached: EtiquetaOption[];
  catalog: EtiquetaOption[];
  attachAction: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  detachAction: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  createAndAttachAction: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  hiddenFields: Record<string, string>;
};

function buildFormData(
  hiddenFields: Record<string, string>,
  fields: Record<string, string>,
) {
  const formData = new FormData();
  for (const [name, value] of Object.entries(hiddenFields)) {
    formData.append(name, value);
  }
  for (const [name, value] of Object.entries(fields)) {
    formData.append(name, value);
  }
  return formData;
}

export function EtiquetaPicker({
  attached,
  catalog,
  attachAction,
  detachAction,
  createAndAttachAction,
  hiddenFields,
}: EtiquetaPickerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");
  const [createName, setCreateName] = useState("");
  const [createColor, setCreateColor] = useState<LabelColor>(DEFAULT_LABEL_COLOR);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_LABELS);
  const [isPending, startTransition] = useTransition();

  const attachedIds = new Set(attached.map((label) => label.id));
  const normalizedQuery = normalizeLabelQuery(query);
  const filteredCatalog = filterLabelsByQuery(catalog, normalizedQuery);
  const visibleLabels = filteredCatalog.slice(0, visibleCount);
  const hasMore = filteredCatalog.length > visibleCount;

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_LABELS);
  }, [query, open]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setQuery("");
      setCreating(false);
      setCreateName("");
      setCreateColor(DEFAULT_LABEL_COLOR);
      setVisibleCount(INITIAL_VISIBLE_LABELS);
    }
  }

  function runAction(
    action: (prevState: ActionState, formData: FormData) => Promise<ActionState>,
    fields: Record<string, string>,
    successMessage: string,
  ) {
    startTransition(async () => {
      const result = await action({}, buildFormData(hiddenFields, fields));
      if (result.error) {
        showErrorToast(result.error);
        return;
      }

      showSuccessToast(successMessage);
      router.refresh();
    });
  }

  function toggleLabel(labelId: string) {
    if (attachedIds.has(labelId)) {
      runAction(detachAction, { labelId }, t("toast.labelDetached"));
      return;
    }
    runAction(attachAction, { labelId }, t("toast.labelAttached"));
  }

  function createLabel() {
    const name = createName.trim();
    if (!name) {
      return;
    }
    runAction(
      createAndAttachAction,
      { name, color: createColor },
      t("toast.labelCreated"),
    );
    setCreating(false);
    setCreateName("");
    setCreateColor(DEFAULT_LABEL_COLOR);
  }

  return (
    <div className={isPending ? "opacity-70" : ""}>
      {attached.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {attached.map((label) => (
            <LabelChip key={label.id} name={label.name} color={label.color} />
          ))}
        </div>
      )}

      <Dialog.Root open={open} onOpenChange={handleOpenChange}>
        <Dialog.Trigger
          render={
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            />
          }
        >
          {t("labels.editLabels")}
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup className="flex max-h-[min(32rem,90dvh)] max-w-sm flex-col overflow-hidden">
            {creating ? (
              <div className="flex min-h-0 flex-1 flex-col">
                <LabelEditorForm
                  title={t("labels.createLabel")}
                  name={createName}
                  color={createColor}
                  disabled={isPending}
                  showDelete={false}
                  onNameChange={setCreateName}
                  onColorChange={setCreateColor}
                  onBack={createLabel}
                  onClose={() => setCreating(false)}
                  onRemoveColor={() => setCreateColor(DEFAULT_LABEL_COLOR)}
                />
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="relative shrink-0 border-b border-gray-200 px-4 py-3">
                  <Dialog.Close
                    render={
                      <button
                        type="button"
                        aria-label={t("common.cancel")}
                        className="absolute top-2 right-2 rounded p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                      />
                    }
                  >
                    <XMarkIcon className="size-5" />
                  </Dialog.Close>
                  <Dialog.Title className="text-center text-base font-semibold">
                    {t("labels.title")}
                  </Dialog.Title>
                </div>

                <div className="shrink-0 px-4 pt-4">
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t("labels.searchPlaceholder")}
                    aria-label={t("labels.searchPlaceholder")}
                  />
                </div>

                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-4">
                  {filteredCatalog.length === 0 ? (
                    <p className="text-sm text-gray-500">{t("labels.noResults")}</p>
                  ) : (
                    visibleLabels.map((label) => (
                      <LabelListRow
                        key={label.id}
                        name={label.name}
                        color={label.color}
                        checked={attachedIds.has(label.id)}
                        disabled={isPending}
                        onToggle={() => toggleLabel(label.id)}
                        trailing={
                          <Link
                            href="/labels"
                            aria-label={t("labels.editLabel", { name: label.name })}
                            className="shrink-0 rounded p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                          >
                            <PencilSquareIcon />
                          </Link>
                        }
                      />
                    ))
                  )}
                </div>

                <div className="shrink-0 space-y-2 border-t border-gray-200 px-4 py-4">
                  <button
                    type="button"
                    onClick={() => {
                      setCreating(true);
                      setCreateName(query.trim());
                    }}
                    className={LABEL_LIST_FOOTER_BUTTON_CLASS}
                  >
                    {t("labels.createNew")}
                  </button>
                  {hasMore && (
                    <button
                      type="button"
                      onClick={() => setVisibleCount((count) => count + LOAD_MORE_LABELS_STEP)}
                      className={LABEL_LIST_FOOTER_BUTTON_CLASS}
                    >
                      {t("labels.showMore")}
                    </button>
                  )}
                </div>
              </div>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {attached.length === 0 && (
        <p className="mt-2 text-sm text-gray-500">{t("labels.noneApplied")}</p>
      )}
    </div>
  );
}
