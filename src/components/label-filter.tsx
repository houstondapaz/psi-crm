import Link from "next/link";
import type { LabelView } from "@/services/label-service";
import { LabelChip } from "@/components/label-chip";

type LabelFilterProps = {
  catalog: LabelView[];
  selectedIds: string[];
  basePath: string;
};

export function LabelFilter({ catalog, selectedIds, basePath }: LabelFilterProps) {
  if (catalog.length === 0) {
    return null;
  }

  const selected = new Set(selectedIds);

  function hrefFor(labelId: string) {
    const next = new Set(selected);
    if (next.has(labelId)) {
      next.delete(labelId);
    } else {
      next.add(labelId);
    }
    const params = [...next].map((id) => `label=${encodeURIComponent(id)}`).join("&");
    return params ? `${basePath}?${params}` : basePath;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">Filtrar por etiquetas</p>
      <div className="flex flex-wrap items-center gap-2">
        {catalog.map((label) => {
          const active = selected.has(label.id);
          return (
            <Link
              key={label.id}
              href={hrefFor(label.id)}
              className={`rounded-full transition ${active ? "ring-2 ring-gray-900 ring-offset-1" : "opacity-70 hover:opacity-100"}`}
            >
              <LabelChip name={label.name} color={label.color} />
            </Link>
          );
        })}
        {selectedIds.length > 0 && (
          <Link
            href={basePath}
            className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            Limpar filtro
          </Link>
        )}
      </div>
      {selectedIds.length > 1 && (
        <p className="text-xs text-gray-500">Mostrando registros com todas as etiquetas selecionadas.</p>
      )}
    </div>
  );
}
