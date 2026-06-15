import { describe, it, expect, beforeEach, vi } from "vitest";
import { resetDatabase } from "../helpers/db";
import { registerPractice } from "@/services/auth-service";
import { createPatient } from "@/services/patient-service";
import { createReminder } from "@/services/reminder-service";
import { notifyAlertsByEmail } from "@/services/alert-service";

describe("Alert email", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("sends email for due alerts once per day", async () => {
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

    const sendEmail = vi.fn().mockResolvedValue(undefined);
    const referenceDate = new Date("2026-06-11T12:00:00Z");

    const sent = await notifyAlertsByEmail(auth, sendEmail, referenceDate);
    expect(sent.length).toBeGreaterThan(0);
    expect(sendEmail).toHaveBeenCalledTimes(1);

    const sentAgain = await notifyAlertsByEmail(auth, sendEmail, referenceDate);
    expect(sentAgain).toHaveLength(0);
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });
});
