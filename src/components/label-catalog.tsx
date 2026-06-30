"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createLabelAction,
  deleteLabelAction,
  updateLabelAction,
} from "@/app/actions/domain";
import { LabelEditorForm } from "@/components/label-editor-form";
import { LabelListRow } from "@/components/label-list-row";
import { Input } from "@/components/ui/input";
import {
  DEFAULT_LABEL_COLOR,
  resolveLabelColor,
  type LabelColor,
} from "@/lib/label-colors";
import {
  filterLabelsByQuery,
  INITIAL_VISIBLE_LABELS,
  LABEL_LIST_FOOTER_BUTTON_CLASS,
  LOAD_MORE_LABELS_STEP,
  normalizeLabelQuery,
  type LabelListItem,
} from "@/lib/label-list-utils";
import { t } from "@/lib/i18n";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";

type LabelCatalogProps = {
  labels: LabelListItem[];
};

export function LabelCatalog({ labels }: LabelCatalogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createColor, setCreateColor] = useState<LabelColor>(DEFAULT_LABEL_COLOR);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_LABELS);
  const [editingLabel, setEditingLabel] = useState<LabelListItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState<LabelColor>(DEFAULT_LABEL_COLOR);
  const [isPending, startTransition] = useTransition();

  const normalizedQuery = normalizeLabelQuery(query);
  const filteredLabels = filterLabelsByQuery(labels, normalizedQuery);
  const visibleLabels = filteredLabels.slice(0, visibleCount);
  const hasMore = filteredLabels.length > visibleCount;
  const editorOpen = creating || editingLabel !== null;

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_LABELS);
  }, [query]);

  function resetCreate() {
    setCreating(false);
    setCreateName("");
    setCreateColor(DEFAULT_LABEL_COLOR);
  }

  function resetEdit() {
    setEditingLabel(null);
    setEditName("");
    setEditColor(DEFAULT_LABEL_COLOR);
  }

  function runCreate() {
    const name = createName.trim();
    if (!name) {
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("color", createColor);

    startTransition(async () => {
      const result = await createLabelAction({}, formData);
      if (result.error) {
        showErrorToast(result.error);
        return;
      }

      showSuccessToast(t("toast.labelCreated"));
      resetCreate();
      router.refresh();
    });
  }

  function runUpdate() {
    if (!editingLabel) {
      return;
    }

    const name = editName.trim();
    if (!name) {
      return;
    }

    const formData = new FormData();
    formData.append("labelId", editingLabel.id);
    formData.append("name", name);
    formData.append("color", editColor);

    startTransition(async () => {
      const result = await updateLabelAction({}, formData);
      if (result.error) {
        showErrorToast(result.error);
        return;
      }

      showSuccessToast(t("toast.labelSaved"));
      resetEdit();
      router.refresh();
    });
  }

  function runDelete() {
    if (!editingLabel) {
      return;
    }

    const formData = new FormData();
    formData.append("labelId", editingLabel.id);

    startTransition(async () => {
      const result = await deleteLabelAction({}, formData);
      if (result.error) {
        showErrorToast(result.error);
        return;
      }

      showSuccessToast(t("toast.labelDeleted"));
      resetEdit();
      router.refresh();
    });
  }

  function openEdit(label: LabelListItem) {
    setEditingLabel(label);
    setEditName(label.name);
    setEditColor(resolveLabelColor(label.color));
    setCreating(false);
  }

  return (
    <div className="flex max-h-[min(40rem,90dvh)] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {editorOpen ? (
        <LabelEditorForm
          title={creating ? t("labels.createLabel") : t("labels.editLabelTitle")}
          name={creating ? createName : editName}
          color={creating ? createColor : editColor}
          disabled={isPending}
          nameInputId={creating ? "catalog-create-label-name" : "catalog-edit-label-name"}
          showDelete={!creating}
          onNameChange={creating ? setCreateName : setEditName}
          onColorChange={creating ? setCreateColor : setEditColor}
          onBack={() => {
            if (creating) {
              runCreate();
              return;
            }
            runUpdate();
          }}
          onClose={() => {
            if (creating) {
              resetCreate();
              return;
            }
            resetEdit();
          }}
          onRemoveColor={() => {
            if (creating) {
              setCreateColor(DEFAULT_LABEL_COLOR);
              return;
            }
            setEditColor(DEFAULT_LABEL_COLOR);
          }}
          onDelete={creating ? undefined : runDelete}
        />
      ) : (
        <>
          <div className="px-4 pt-4">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("labels.searchPlaceholder")}
              aria-label={t("labels.searchPlaceholder")}
            />
          </div>

          <div className="max-h-[min(32rem,70dvh)] space-y-2 overflow-y-auto px-4 py-4">
            {filteredLabels.length === 0 ? (
              <p className="text-sm text-gray-500">{t("labels.noResults")}</p>
            ) : (
              visibleLabels.map((label) => (
                <LabelListRow
                  key={label.id}
                  name={label.name}
                  color={label.color}
                  onClick={() => openEdit(label)}
                />
              ))
            )}
          </div>

          <div className="space-y-2 border-t border-gray-200 px-4 py-4">
            <button
              type="button"
              onClick={() => {
                setCreating(true);
                setCreateName(query.trim());
                setCreateColor(DEFAULT_LABEL_COLOR);
                resetEdit();
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
        </>
      )}
    </div>
  );
}
