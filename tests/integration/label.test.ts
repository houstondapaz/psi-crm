import { describe, it, expect, beforeEach } from "vitest";
import { resetDatabase } from "../helpers/db";
import { registerPractice } from "@/services/auth-service";
import { createPatient } from "@/services/patient-service";
import { createSession } from "@/services/session-service";
import {
  attachLabelToPatient,
  attachLabelToSession,
  createLabel,
  deleteLabel,
  detachLabelFromPatient,
  listLabels,
  listLabelsByPatient,
  listLabelsBySession,
  updateLabel,
} from "@/services/label-service";
import { listPatients } from "@/services/patient-service";
import { listAllSessions } from "@/services/session-service";

describe("LabelService", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("creates etiqueta in practice catalog", async () => {
    const { practice, user } = await registerPractice({
      practiceName: "Consultório",
      userName: "Dra. Ana",
      email: "ana@example.com",
      password: "senha123",
    });
    const auth = { practiceId: practice.id, userId: user.id };

    const label = await createLabel(auth, {
      name: "TCC",
      color: "blue",
    });

    expect(label.name).toBe("TCC");
    expect(label.color).toBe("blue");

    const labels = await listLabels(auth);
    expect(labels).toHaveLength(1);
    expect(labels[0]?.name).toBe("TCC");
  });

  it("rejects duplicate etiqueta names in the same practice", async () => {
    const { practice, user } = await registerPractice({
      practiceName: "Consultório",
      userName: "Dra. Ana",
      email: "ana2@example.com",
      password: "senha123",
    });
    const auth = { practiceId: practice.id, userId: user.id };

    await createLabel(auth, { name: "TCC", color: "blue" });

    await expect(createLabel(auth, { name: "TCC", color: "green" })).rejects.toThrow(
      "errors.labelNameExists",
    );
  });

  it("attaches etiquetas to patient and session independently", async () => {
    const { practice, user } = await registerPractice({
      practiceName: "Consultório",
      userName: "Dra. Ana",
      email: "ana3@example.com",
      password: "senha123",
    });
    const auth = { practiceId: practice.id, userId: user.id };
    const patient = await createPatient(auth, { name: "Carlos" });
    const session = await createSession(auth, { patientId: patient.id });
    const tcc = await createLabel(auth, { name: "TCC", color: "blue" });
    const crise = await createLabel(auth, { name: "Crise", color: "red" });

    await attachLabelToPatient(auth, patient.id, tcc.id);
    await attachLabelToSession(auth, session.id, crise.id);

    expect(await listLabelsByPatient(auth, patient.id)).toEqual([
      expect.objectContaining({ name: "TCC" }),
    ]);
    expect(await listLabelsBySession(auth, session.id)).toEqual([
      expect.objectContaining({ name: "Crise" }),
    ]);
    expect(await listLabelsBySession(auth, session.id)).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "TCC" })]),
    );
  });

  it("deletes etiqueta and detaches from patients and sessions", async () => {
    const { practice, user } = await registerPractice({
      practiceName: "Consultório",
      userName: "Dra. Ana",
      email: "ana4@example.com",
      password: "senha123",
    });
    const auth = { practiceId: practice.id, userId: user.id };
    const patient = await createPatient(auth, { name: "Carlos" });
    const session = await createSession(auth, { patientId: patient.id });
    const label = await createLabel(auth, { name: "Crise", color: "red" });

    await attachLabelToPatient(auth, patient.id, label.id);
    await attachLabelToSession(auth, session.id, label.id);
    await deleteLabel(auth, label.id);

    expect(await listLabels(auth)).toHaveLength(0);
    expect(await listLabelsByPatient(auth, patient.id)).toHaveLength(0);
    expect(await listLabelsBySession(auth, session.id)).toHaveLength(0);
  });

  it("updates etiqueta and detaches from patient", async () => {
    const { practice, user } = await registerPractice({
      practiceName: "Consultório",
      userName: "Dra. Ana",
      email: "ana5@example.com",
      password: "senha123",
    });
    const auth = { practiceId: practice.id, userId: user.id };
    const patient = await createPatient(auth, { name: "Carlos" });
    const label = await createLabel(auth, { name: "TCC", color: "blue" });

    await attachLabelToPatient(auth, patient.id, label.id);
    await updateLabel(auth, label.id, { name: "Terapia Cognitiva", color: "teal" });
    await detachLabelFromPatient(auth, patient.id, label.id);

    const labels = await listLabels(auth);
    expect(labels[0]?.name).toBe("Terapia Cognitiva");
    expect(await listLabelsByPatient(auth, patient.id)).toHaveLength(0);
  });

  it("filters patients and sessions by all selected etiquetas", async () => {
    const { practice, user } = await registerPractice({
      practiceName: "Consultório",
      userName: "Dra. Ana",
      email: "ana6@example.com",
      password: "senha123",
    });
    const auth = { practiceId: practice.id, userId: user.id };
    const ana = await createPatient(auth, { name: "Ana" });
    const bruno = await createPatient(auth, { name: "Bruno" });
    const session = await createSession(auth, { patientId: ana.id });
    const tcc = await createLabel(auth, { name: "TCC", color: "blue" });
    const crise = await createLabel(auth, { name: "Crise", color: "red" });

    await attachLabelToPatient(auth, ana.id, tcc.id);
    await attachLabelToPatient(auth, ana.id, crise.id);
    await attachLabelToPatient(auth, bruno.id, tcc.id);
    await attachLabelToSession(auth, session.id, tcc.id);
    await attachLabelToSession(auth, session.id, crise.id);

    const patients = await listPatients(auth, { labelIds: [tcc.id, crise.id] });
    const sessions = await listAllSessions(auth, { labelIds: [tcc.id, crise.id] });

    expect(patients.map((patient) => patient.name)).toEqual(["Ana"]);
    expect(sessions).toHaveLength(1);
  });
});
