import { LOCALE } from "@/lib/i18n";
import type { LabelColor } from "@/lib/label-colors";

export type LabelListItem = {
  id: string;
  name: string;
  color: LabelColor;
};

export const INITIAL_VISIBLE_LABELS = 8;
export const LOAD_MORE_LABELS_STEP = 8;

export const LABEL_LIST_FOOTER_BUTTON_CLASS =
  "w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50";

export function normalizeLabelQuery(value: string) {
  return value.trim().toLocaleLowerCase(LOCALE);
}

export function filterLabelsByQuery(labels: LabelListItem[], normalizedQuery: string) {
  if (!normalizedQuery) {
    return labels;
  }
  return labels.filter((label) =>
    normalizeLabelQuery(label.name).includes(normalizedQuery),
  );
}
