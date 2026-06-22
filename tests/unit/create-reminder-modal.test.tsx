// @vitest-environment jsdom

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateReminderModal } from "@/components/create-reminder-modal";

vi.mock("@/app/actions/domain", () => ({
  createReminderAction: vi.fn(),
}));

describe("CreateReminderModal", () => {
  it("opens reminder registration form when trigger is clicked", async () => {
    const user = userEvent.setup();

    render(<CreateReminderModal patientId="patient-1" />);

    expect(screen.queryByLabelText("Data alvo")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Novo lembrete" }));

    expect(screen.getByLabelText("Data alvo")).not.toBeNull();
    expect(screen.getByLabelText("Descrição")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Criar lembrete" })).not.toBeNull();
  });
});
