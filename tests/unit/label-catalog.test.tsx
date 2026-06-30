// @vitest-environment jsdom

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LabelCatalog } from "@/components/label-catalog";
import { LABEL_COLORS } from "@/lib/label-colors";
import type { LabelListItem } from "@/lib/label-list-utils";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("@/app/actions/domain", () => ({
  createLabelAction: vi.fn(),
  updateLabelAction: vi.fn(),
  deleteLabelAction: vi.fn(),
}));

const labels: LabelListItem[] = [
  { id: "1", name: "TCC", color: "blue" },
  { id: "2", name: "Crise", color: "red" },
  { id: "3", name: "Agendado", color: "green" },
];

describe("LabelCatalog", () => {
  it("opens the editor when a label is clicked", async () => {
    const user = userEvent.setup();

    render(<LabelCatalog labels={labels} />);

    expect(screen.queryByText("Editar Etiqueta")).toBeNull();

    await user.click(screen.getByRole("button", { name: "TCC" }));

    expect(screen.getByText("Editar Etiqueta")).not.toBeNull();
    expect((screen.getByLabelText("Título") as HTMLInputElement).value).toBe("TCC");
    expect(screen.getByRole("button", { name: "Excluir" })).not.toBeNull();
  });

  it("opens create form with all color swatches", async () => {
    const user = userEvent.setup();

    render(<LabelCatalog labels={labels} />);

    await user.click(screen.getByRole("button", { name: "Criar uma nova etiqueta" }));

    expect(screen.getByText("Criar Etiqueta")).not.toBeNull();

    const colorSwatches = screen
      .getAllByRole("button")
      .filter((button) => button.hasAttribute("aria-pressed"));

    expect(colorSwatches).toHaveLength(LABEL_COLORS.length);
  });

  it("filters labels by search query", async () => {
    const user = userEvent.setup();

    render(<LabelCatalog labels={labels} />);

    await user.type(screen.getByLabelText("Buscar etiquetas…"), "crise");

    expect(screen.getByRole("button", { name: "Crise" })).not.toBeNull();
    expect(screen.queryByRole("button", { name: "TCC" })).toBeNull();
  });

  it("reveals more labels when show more is clicked", async () => {
    const user = userEvent.setup();
    const manyLabels = Array.from({ length: 10 }, (_, index) => ({
      id: String(index + 1),
      name: `Etiqueta ${index + 1}`,
      color: "green" as const,
    }));

    render(<LabelCatalog labels={manyLabels} />);

    expect(screen.queryByRole("button", { name: "Etiqueta 10" })).toBeNull();

    await user.click(screen.getByRole("button", { name: "Mostrar mais etiquetas" }));

    expect(screen.getByRole("button", { name: "Etiqueta 10" })).not.toBeNull();
  });
});
