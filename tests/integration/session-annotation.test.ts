import { describe, it, expect, beforeEach } from "vitest";
import { resetDatabase } from "../helpers/db";
import { registerPractice } from "@/services/auth-service";
import { createPatient } from "@/services/patient-service";
import { createSession } from "@/services/session-service";
import {
  createAnnotation,
  deleteAnnotation,
  listAnnotationsBySession,
  updateAnnotation,
} from "@/services/session-annotation-service";

describe("SessionAnnotationService", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("creates annotation with default recordedAt", async () => {
    const { practice, user } = await registerPractice({
      practiceName: "Consultório",
      userName: "Dra. Ana",
      email: "ana@example.com",
      password: "senha123",
    });
    const auth = { practiceId: practice.id, userId: user.id };
    const patient = await createPatient(auth, { name: "Carlos" });
    const session = await createSession(auth, { patientId: patient.id });

    const before = Date.now();
    const annotation = await createAnnotation(auth, {
      sessionId: session.id,
      content: "Paciente relatou ansiedade no trabalho.",
    });
    const after = Date.now();

    expect(annotation.content).toContain("ansiedade");
    expect(annotation.recordedAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(annotation.recordedAt.getTime()).toBeLessThanOrEqual(after);
  });

  it("lists annotations ordered by recordedAt ascending", async () => {
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
      content: "Primeira anotação",
      recordedAt: new Date("2026-01-01T10:00:00Z"),
    });
    await createAnnotation(auth, {
      sessionId: session.id,
      content: "Segunda anotação",
      recordedAt: new Date("2026-01-02T10:00:00Z"),
    });

    const annotations = await listAnnotationsBySession(auth, session.id);
    expect(annotations).toHaveLength(2);
    expect(annotations[0].content).toBe("Primeira anotação");
    expect(annotations[1].content).toBe("Segunda anotação");
  });

  it("updates annotation content and recordedAt", async () => {
    const { practice, user } = await registerPractice({
      practiceName: "Consultório",
      userName: "Dra. Ana",
      email: "ana3@example.com",
      password: "senha123",
    });
    const auth = { practiceId: practice.id, userId: user.id };
    const patient = await createPatient(auth, { name: "Carlos" });
    const session = await createSession(auth, { patientId: patient.id });
    const annotation = await createAnnotation(auth, {
      sessionId: session.id,
      content: "Texto original",
    });

    const newDate = new Date("2026-06-01T14:00:00Z");
    const updated = await updateAnnotation(auth, {
      annotationId: annotation.id,
      content: "Texto revisado",
      recordedAt: newDate,
    });

    expect(updated.content).toBe("Texto revisado");
    expect(updated.recordedAt.toISOString()).toBe(newDate.toISOString());
  });

  it("deletes annotation", async () => {
    const { practice, user } = await registerPractice({
      practiceName: "Consultório",
      userName: "Dra. Ana",
      email: "ana4@example.com",
      password: "senha123",
    });
    const auth = { practiceId: practice.id, userId: user.id };
    const patient = await createPatient(auth, { name: "Carlos" });
    const session = await createSession(auth, { patientId: patient.id });
    const annotation = await createAnnotation(auth, {
      sessionId: session.id,
      content: "Para excluir",
    });

    await deleteAnnotation(auth, annotation.id);
    const annotations = await listAnnotationsBySession(auth, session.id);
    expect(annotations).toHaveLength(0);
  });
});
