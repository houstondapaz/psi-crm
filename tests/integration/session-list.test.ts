import { describe, it, expect, beforeEach } from "vitest";
import { resetDatabase } from "../helpers/db";
import { registerPractice } from "@/services/auth-service";
import { createPatient } from "@/services/patient-service";
import {
  createSession,
  getSessionById,
  listAllSessions,
  scheduleSession,
  updateSession,
} from "@/services/session-service";
import { createAnnotation } from "@/services/session-annotation-service";

describe("Session list and detail", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("lists all sessions with patient name and display date", async () => {
    const { practice, user } = await registerPractice({
      practiceName: "Consultório",
      userName: "Dra. Ana",
      email: "ana@example.com",
      password: "senha123",
    });
    const auth = { practiceId: practice.id, userId: user.id };
    const maria = await createPatient(auth, { name: "Maria Silva" });
    const joao = await createPatient(auth, { name: "João Santos" });

    await createSession(auth, {
      patientId: maria.id,
      occurredAt: new Date("2026-06-14T10:00:00Z"),
    });
    await scheduleSession(auth, {
      patientId: joao.id,
      scheduledAt: new Date("2026-06-20T15:30:00Z"),
    });

    const sessions = await listAllSessions(auth);
    expect(sessions).toHaveLength(2);
    expect(sessions[0].patientName).toBe("João Santos");
    expect(sessions[0].displayDate?.toISOString()).toBe(
      "2026-06-20T15:30:00.000Z",
    );
    expect(sessions[1].patientName).toBe("Maria Silva");
    expect(sessions[1].displayDate?.toISOString()).toBe(
      "2026-06-14T10:00:00.000Z",
    );
  });

  it("returns session with patient name and annotations", async () => {
    const { practice, user } = await registerPractice({
      practiceName: "Consultório",
      userName: "Dra. Ana",
      email: "ana2@example.com",
      password: "senha123",
    });
    const auth = { practiceId: practice.id, userId: user.id };
    const patient = await createPatient(auth, { name: "Carlos" });
    const session = await createSession(auth, { patientId: patient.id });
    await createAnnotation(auth, {
      sessionId: session.id,
      content: "Anotação clínica",
    });

    const detail = await getSessionById(auth, session.id);
    expect(detail).not.toBeNull();
    expect(detail!.patientName).toBe("Carlos");
    expect(detail!.annotations).toHaveLength(1);
    expect(detail!.annotations[0].content).toBe("Anotação clínica");
  });

  it("updates session metadata", async () => {
    const { practice, user } = await registerPractice({
      practiceName: "Consultório",
      userName: "Dra. Ana",
      email: "ana3@example.com",
      password: "senha123",
    });
    const auth = { practiceId: practice.id, userId: user.id };
    const patient = await createPatient(auth, { name: "Carlos" });
    const session = await scheduleSession(auth, {
      patientId: patient.id,
      scheduledAt: new Date("2026-06-20T10:00:00Z"),
    });

    const occurredAt = new Date("2026-06-20T11:00:00Z");
    const updated = await updateSession(auth, session.id, {
      status: "completed",
      occurredAt,
    });

    expect(updated.status).toBe("completed");
    expect(updated.occurredAt?.toISOString()).toBe(occurredAt.toISOString());
  });
});
