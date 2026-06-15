import { describe, it, expect, beforeEach } from "vitest";
import { resetDatabase } from "../helpers/db";
import { registerPractice } from "@/services/auth-service";
import { createPatient } from "@/services/patient-service";
import { createReminder } from "@/services/reminder-service";
import { scheduleSession } from "@/services/session-service";
import { listAgendaEvents } from "@/services/agenda-service";
import { getAgendaRange } from "@/lib/agenda-utils";

describe("AgendaService", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("lists sessions and reminders in calendar range", async () => {
    const { practice, user } = await registerPractice({
      practiceName: "Consultório",
      userName: "Dra. Ana",
      email: "ana@example.com",
      password: "senha123",
    });
    const auth = { practiceId: practice.id, userId: user.id };
    const patient = await createPatient(auth, { name: "Carlos" });

    await createReminder(auth, {
      patientId: patient.id,
      targetDate: "2026-06-15",
      description: "Retomar contato",
    });
    await scheduleSession(auth, {
      patientId: patient.id,
      scheduledAt: new Date("2026-06-20T14:00:00Z"),
    });

    const anchor = new Date("2026-06-01T12:00:00");
    const { start, end } = getAgendaRange("month", anchor);
    const events = await listAgendaEvents(auth, start, end);

    expect(events).toHaveLength(2);
    expect(events.some((event) => event.type === "reminder")).toBe(true);
    expect(events.some((event) => event.type === "session")).toBe(true);
  });
});
