import { describe, it, expect, beforeEach } from "vitest";
import { resetDatabase } from "../helpers/db";
import { registerPractice } from "@/services/auth-service";
import { createPatient, listPatients } from "@/services/patient-service";

describe("PatientService", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("creates and lists patients scoped to practice", async () => {
    const a = await registerPractice({
      practiceName: "Consultório A",
      userName: "Psicóloga A",
      email: "a@example.com",
      password: "senha123",
    });
    const b = await registerPractice({
      practiceName: "Consultório B",
      userName: "Psicóloga B",
      email: "b@example.com",
      password: "senha123",
    });

    await createPatient(
      { practiceId: a.practice.id, userId: a.user.id },
      { name: "Maria" },
    );

    await createPatient(
      { practiceId: b.practice.id, userId: b.user.id },
      { name: "João" },
    );

    const patientsA = await listPatients({
      practiceId: a.practice.id,
      userId: a.user.id,
    });

    expect(patientsA).toHaveLength(1);
    expect(patientsA[0]?.name).toBe("Maria");
  });
});
