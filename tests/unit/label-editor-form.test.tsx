// @vitest-environment jsdom

import type { ComponentProps } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LabelEditorForm } from "@/components/label-editor-form";
import { DEFAULT_LABEL_COLOR, LABEL_COLORS } from "@/lib/label-colors";

function renderEditor(overrides: Partial<ComponentProps<typeof LabelEditorForm>> = {}) {
  const props: ComponentProps<typeof LabelEditorForm> = {
    title: "Criar Etiqueta",
    name: "",
    color: DEFAULT_LABEL_COLOR,
    onNameChange: vi.fn(),
    onColorChange: vi.fn(),
    onBack: vi.fn(),
    onClose: vi.fn(),
    ...overrides,
  };

  return {
    ...render(<LabelEditorForm {...props} />),
    props,
  };
}

describe("LabelEditorForm", () => {
  it("renders title field, preview and all 30 color swatches", () => {
    renderEditor();

    expect(screen.getByText("Título")).not.toBeNull();
    expect(screen.getByText("Selecionar uma cor")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Remover cor" })).not.toBeNull();

    const colorSwatches = screen
      .getAllByRole("button")
      .filter((button) => button.hasAttribute("aria-pressed"));

    expect(colorSwatches).toHaveLength(LABEL_COLORS.length);
  });

  it("calls onColorChange when a swatch is clicked", async () => {
    const user = userEvent.setup();
    const onColorChange = vi.fn();

    renderEditor({ onColorChange });

    const yellowSwatch = screen.getByRole("button", { name: "Amarelo" });
    await user.click(yellowSwatch);

    expect(onColorChange).toHaveBeenCalledWith("yellow");
  });

  it("shows delete action only when enabled", () => {
    const onDelete = vi.fn();

    renderEditor({ showDelete: true, onDelete, name: "TCC" });

    expect(screen.getByRole("button", { name: "Excluir" })).not.toBeNull();
  });
});
