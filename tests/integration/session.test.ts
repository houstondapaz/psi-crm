import { describe, it, expect, beforeEach } from "vitest";
import { resetDatabase } from "../helpers/db";
import { registerPractice } from "@/services/auth-service";
import { createPatient } from "@/services/patient-service";
import { createSession } from "@/services/session-service";
import { createAnnotation } from "@/services/session-annotation-service";

describe("SessionService", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("creates completed session for patient", async () => {
    const { practice, user } = await registerPractice({
      practiceName: "Consultório",
      userName: "Dra. Ana",
      email: "ana@example.com",
      password: "senha123",
    });

    const auth = { practiceId: practice.id, userId: user.id };
    const patient = await createPatient(auth, { name: "Carlos" });

    const session = await createSession(auth, {
      patientId: patient.id,
    });

    const annotation = await createAnnotation(auth, {
      sessionId: session.id,
      content: "Paciente relatou ansiedade no trabalho.",
    });

    expect(annotation.content).toContain("ansiedade");
    expect(session.status).toBe("completed");
    expect(session.patientId).toBe(patient.id);
  });
});
