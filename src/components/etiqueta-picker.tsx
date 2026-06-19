"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { LABEL_COLORS, LABEL_COLOR_CLASSES, type LabelColor } from "@/lib/label-colors";
import { LOCALE, t } from "@/lib/i18n";
import { LabelChip } from "@/components/label-chip";
import { FormError } from "@/components/ui/form-error";

export type EtiquetaOption = {
  id: string;
  name: string;
  color: LabelColor;
};

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

function normalizeQuery(value: string) {
  return value.trim().toLocaleLowerCase(LOCALE);
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
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [createColor, setCreateColor] = useState<LabelColor>("blue");
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const attachedIds = new Set(attached.map((label) => label.id));
  const normalizedQuery = normalizeQuery(query);

  const suggestions = catalog.filter((label) => {
    if (attachedIds.has(label.id)) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    return normalizeQuery(label.name).includes(normalizedQuery);
  });

  const exactCatalogMatch = catalog.some(
    (label) => normalizeQuery(label.name) === normalizedQuery,
  );
  const showCreate = normalizedQuery.length > 0 && !exactCatalogMatch;

  const optionCount = suggestions.length + (showCreate ? 1 : 0);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open, suggestions.length, showCreate]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function runAction(
    action: (prevState: ActionState, formData: FormData) => Promise<ActionState>,
    fields: Record<string, string>,
  ) {
    startTransition(async () => {
      const result = await action({}, buildFormData(hiddenFields, fields));
      if (result.error) {
        setError(result.error);
        return;
      }

      setError(undefined);
      setQuery("");
      setOpen(false);
      router.refresh();
    });
  }

  function attachLabel(labelId: string) {
    runAction(attachAction, { labelId });
  }

  function detachLabel(labelId: string) {
    runAction(detachAction, { labelId });
  }

  function createLabel() {
    const name = query.trim();
    if (!name) {
      return;
    }
    runAction(createAndAttachAction, {
      name,
      color: createColor,
    });
  }

  function selectActiveOption() {
    if (activeIndex < suggestions.length) {
      const label = suggestions[activeIndex];
      if (label) {
        attachLabel(label.id);
      }
      return;
    }
    if (showCreate) {
      createLabel();
    }
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => (optionCount === 0 ? 0 : (index + 1) % optionCount));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) =>
        optionCount === 0 ? 0 : (index - 1 + optionCount) % optionCount,
      );
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (open && optionCount > 0) {
        selectActiveOption();
      } else if (showCreate) {
        createLabel();
      }
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "Backspace" && query === "" && attached.length > 0) {
      const last = attached[attached.length - 1];
      if (last) {
        detachLabel(last.id);
      }
    }
  }

  const showDropdown = open && (suggestions.length > 0 || showCreate);

  return (
    <div ref={containerRef} className="relative">
      <FormError message={error} />
      <div
        className={`flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2 py-1.5 shadow-sm focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900 ${
          isPending ? "opacity-70" : ""
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {attached.map((label) => (
          <button
            key={label.id}
            type="button"
            disabled={isPending}
            onClick={(event) => {
              event.stopPropagation();
              detachLabel(label.id);
            }}
            className="group inline-flex items-center gap-0.5 rounded-full transition hover:opacity-80"
            title={t("labels.remove", { name: label.name })}
            aria-label={t("labels.removeAria", { name: label.name })}
          >
            <LabelChip name={label.name} color={label.color} />
            <span className="pr-0.5 text-xs text-gray-400 group-hover:text-gray-600">×</span>
          </button>
        ))}
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          disabled={isPending}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleInputKeyDown}
          placeholder={attached.length === 0 ? t("labels.searchPlaceholder") : ""}
          className="min-w-32 flex-1 border-0 bg-transparent px-1 py-1.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
      </div>

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {suggestions.map((label, index) => {
            const active = index === activeIndex;
            return (
              <li key={label.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => attachLabel(label.id)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition ${
                    active ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <LabelChip name={label.name} color={label.color} />
                </button>
              </li>
            );
          })}

          {showCreate && (
            <li role="presentation" className="border-t border-gray-100">
              <div
                className={`px-3 py-2 ${activeIndex === suggestions.length ? "bg-gray-100" : ""}`}
                onMouseEnter={() => setActiveIndex(suggestions.length)}
              >
                <p className="text-sm font-medium text-gray-900">
                  {t("labels.createNamed", { name: query.trim() })}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <div className="flex flex-wrap gap-1">
                    {LABEL_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        aria-label={color}
                        onClick={() => setCreateColor(color)}
                        className={`h-6 w-6 rounded-full border-2 ${LABEL_COLOR_CLASSES[color]} ${
                          createColor === color ? "border-gray-900" : "border-transparent"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={createLabel}
                    className="rounded-sm bg-gray-900 px-3 py-1 text-xs font-medium text-white transition hover:bg-gray-700"
                  >
                    {t("labels.createAndApply")}
                  </button>
                </div>
              </div>
            </li>
          )}
        </ul>
      )}

      {attached.length === 0 && !open && !query && (
        <p className="mt-2 text-sm text-gray-500">{t("labels.noneApplied")}</p>
      )}
    </div>
  );
}
