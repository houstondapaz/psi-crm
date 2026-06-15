import { describe, it, expect, beforeEach } from "vitest";
import { resetDatabase } from "../helpers/db";
import { registerPractice } from "@/services/auth-service";
import { createPatient } from "@/services/patient-service";
import {
  createReminder,
  resolveReminderAsContact,
} from "@/services/reminder-service";
import { listDueAlerts } from "@/services/alert-service";
import { scheduleSession } from "@/services/session-service";

describe("Reminder and Alert", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("lists due reminders and scheduled sessions as alerts", async () => {
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
      targetDate: "2026-06-10",
      description: "Retomar contato",
    });

    await scheduleSession(auth, {
      patientId: patient.id,
      scheduledAt: new Date("2026-06-12T14:00:00Z"),
    });

    const alerts = await listDueAlerts(auth, new Date("2026-06-11T12:00:00Z"));

    expect(alerts.some((a) => a.type === "reminder")).toBe(true);
    expect(alerts.some((a) => a.type === "session")).toBe(true);
  });

  it("resolves reminder as contact", async () => {
    const { practice, user } = await registerPractice({
      practiceName: "Consultório",
      userName: "Dra. Ana",
      email: "ana@example.com",
      password: "senha123",
    });
    const auth = { practiceId: practice.id, userId: user.id };
    const patient = await createPatient(auth, { name: "Carlos" });

    const reminder = await createReminder(auth, {
      patientId: patient.id,
      targetDate: "2026-06-10",
    });

    const result = await resolveReminderAsContact(auth, {
      reminderId: reminder.id,
      type: "whatsapp",
      description: "Mensagem enviada",
    });

    expect(result.contact.type).toBe("whatsapp");
    expect(result.reminder.status).toBe("resolved");
  });
});
