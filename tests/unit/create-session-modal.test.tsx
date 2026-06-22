// @vitest-environment jsdom

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateSessionModal } from "@/components/create-session-modal";

vi.mock("@/app/actions/domain", () => ({
  scheduleSessionAction: vi.fn(),
}));

describe("CreateSessionModal", () => {
  it("opens session scheduling form when trigger is clicked", async () => {
    const user = userEvent.setup();

    render(
      <CreateSessionModal
        patients={[
          { id: "patient-1", name: "Maria" },
          { id: "patient-2", name: "João" },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Nova sessão" }));

    expect(screen.getByLabelText("Paciente")).not.toBeNull();
    expect(screen.getByLabelText("Data e hora")).not.toBeNull();
  });

  it("hides patient selector when defaultPatientId is provided", async () => {
    const user = userEvent.setup();

    render(
      <CreateSessionModal
        patients={[{ id: "patient-1", name: "Maria" }]}
        defaultPatientId="patient-1"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Nova sessão" }));

    expect(screen.queryByLabelText("Paciente")).toBeNull();
    expect(screen.getByLabelText("Data e hora")).not.toBeNull();
  });
});
