import { describe, it, expect, beforeEach } from "vitest";
import { resetDatabase } from "../helpers/db";
import { registerPractice } from "@/services/auth-service";
import { createPatient } from "@/services/patient-service";
import {
  addFileLink,
  createSession,
  deleteFileLink,
  listFileLinksBySession,
  updateFileLink,
} from "@/services/session-service";

describe("FileLink", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("adds google drive link to session", async () => {
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

    await addFileLink(auth, session.id, {
      label: "Prontuário",
      url: "https://drive.google.com/file/d/abc123",
    });

    const links = await listFileLinksBySession(auth, session.id);
    expect(links).toHaveLength(1);
    expect(links[0]?.url).toContain("drive.google.com");
  });

  it("updates and deletes file link", async () => {
    const { practice, user } = await registerPractice({
      practiceName: "Consultório",
      userName: "Dra. Ana",
      email: "ana2@example.com",
      password: "senha123",
    });
    const auth = { practiceId: practice.id, userId: user.id };
    const patient = await createPatient(auth, { name: "Carlos" });
    const session = await createSession(auth, { patientId: patient.id });
    const link = await addFileLink(auth, session.id, {
      label: "Prontuário",
      url: "https://drive.google.com/file/d/old",
    });

    const updated = await updateFileLink(auth, link.id, {
      label: "Prontuário atualizado",
      url: "https://drive.google.com/file/d/new",
    });
    expect(updated.label).toBe("Prontuário atualizado");

    await deleteFileLink(auth, link.id);
    const links = await listFileLinksBySession(auth, session.id);
    expect(links).toHaveLength(0);
  });
});
