"use client";

import {
  DEFAULT_LABEL_COLOR,
  LABEL_COLOR_HEX,
  LABEL_COLORS,
  getLabelTextColor,
  type LabelColor,
} from "@/lib/label-colors";
import { getLabelColorLabel, t } from "@/lib/i18n";
import { LabelPill } from "@/components/label-pill";
import { CheckIcon, ChevronLeftIcon, XMarkIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { LABEL_LIST_FOOTER_BUTTON_CLASS } from "@/lib/label-list-utils";

type LabelEditorFormProps = {
  title: string;
  name: string;
  color: LabelColor;
  disabled?: boolean;
  nameInputId?: string;
  showRemoveColor?: boolean;
  showDelete?: boolean;
  onNameChange: (name: string) => void;
  onColorChange: (color: LabelColor) => void;
  onBack: () => void;
  onClose: () => void;
  onRemoveColor?: () => void;
  onDelete?: () => void;
};

export function LabelEditorForm({
  title,
  name,
  color,
  disabled = false,
  nameInputId = "label-editor-name",
  showRemoveColor = true,
  showDelete = false,
  onNameChange,
  onColorChange,
  onBack,
  onClose,
  onRemoveColor,
  onDelete,
}: LabelEditorFormProps) {
  function handleRemoveColor() {
    if (onRemoveColor) {
      onRemoveColor();
      return;
    }
    onColorChange(DEFAULT_LABEL_COLOR);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative flex shrink-0 items-center border-b border-gray-200 px-2 py-3">
        <button
          type="button"
          disabled={disabled}
          onClick={onBack}
          aria-label={t("common.back")}
          className="rounded p-1.5 text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronLeftIcon />
        </button>
        <h2 className="flex-1 text-center text-base font-semibold text-gray-900">{title}</h2>
        <button
          type="button"
          disabled={disabled}
          onClick={onClose}
          aria-label={t("common.cancel")}
          className="rounded p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
        >
          <XMarkIcon className="size-5" />
        </button>
      </div>

      <div className="shrink-0 bg-gray-100 px-4 py-4">
        <LabelPill name={name} color={color} className="rounded-lg py-3" />
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4">
        <div>
          <label htmlFor={nameInputId} className="text-sm font-semibold text-gray-900">
            {t("labels.titleField")}
          </label>
          <Input
            id={nameInputId}
            value={name}
            disabled={disabled}
            onChange={(event) => onNameChange(event.target.value)}
            className="mt-2"
            autoFocus
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">{t("labels.selectColor")}</p>
          <div className="mt-2 grid grid-cols-5 gap-2">
            {LABEL_COLORS.map((optionColor) => {
              const hex = LABEL_COLOR_HEX[optionColor];
              const selected = color === optionColor;
              const checkColor = getLabelTextColor(hex);

              return (
                <button
                  key={optionColor}
                  type="button"
                  disabled={disabled}
                  aria-label={getLabelColorLabel(optionColor)}
                  aria-pressed={selected}
                  onClick={() => onColorChange(optionColor)}
                  className="relative aspect-[5/3] rounded-md transition hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: hex }}
                >
                  {selected && (
                    <CheckIcon
                      className="absolute inset-0 m-auto size-4 stroke-[2.5]"
                      style={{ color: checkColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="shrink-0 space-y-2 border-t border-gray-200 px-4 py-4">
        {showRemoveColor && (
          <button
            type="button"
            disabled={disabled}
            onClick={handleRemoveColor}
            className={`${LABEL_LIST_FOOTER_BUTTON_CLASS} inline-flex items-center justify-center gap-2`}
          >
            <XMarkIcon className="size-4" />
            {t("labels.removeColor")}
          </button>
        )}
        {showDelete && onDelete && (
          <button
            type="button"
            disabled={disabled}
            onClick={onDelete}
            className={`${LABEL_LIST_FOOTER_BUTTON_CLASS} text-red-700`}
          >
            {t("common.delete")}
          </button>
        )}
      </div>
    </div>
  );
}
