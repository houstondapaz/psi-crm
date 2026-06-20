import { describe, it, expect, beforeEach } from "vitest";
import { resetDatabase } from "../helpers/db";
import { registerPractice } from "@/services/auth-service";
import { createPatient, listPatients, updatePatient } from "@/services/patient-service";

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

  it("creates patient with address and returns it in list", async () => {
    const auth = await registerPractice({
      practiceName: "Consultório A",
      userName: "Psicóloga A",
      email: "a@example.com",
      password: "senha123",
    });

    await createPatient(
      { practiceId: auth.practice.id, userId: auth.user.id },
      {
        name: "Maria",
        address: "Rua Augusta, 123 - Consolação, São Paulo - SP",
      },
    );

    const patients = await listPatients({
      practiceId: auth.practice.id,
      userId: auth.user.id,
    });

    expect(patients).toHaveLength(1);
    expect(patients[0]?.address).toBe(
      "Rua Augusta, 123 - Consolação, São Paulo - SP",
    );
  });

  it("creates patient without address", async () => {
    const auth = await registerPractice({
      practiceName: "Consultório A",
      userName: "Psicóloga A",
      email: "a@example.com",
      password: "senha123",
    });

    await createPatient(
      { practiceId: auth.practice.id, userId: auth.user.id },
      { name: "Maria" },
    );

    const patients = await listPatients({
      practiceId: auth.practice.id,
      userId: auth.user.id,
    });

    expect(patients[0]?.address).toBeNull();
  });

  it("updates patient properties", async () => {
    const auth = await registerPractice({
      practiceName: "Consultório A",
      userName: "Psicóloga A",
      email: "a@example.com",
      password: "senha123",
    });

    const patient = await createPatient(
      { practiceId: auth.practice.id, userId: auth.user.id },
      { name: "Maria", email: "maria@example.com" },
    );

    await updatePatient(
      { practiceId: auth.practice.id, userId: auth.user.id },
      patient.id,
      {
        name: "Maria Silva",
        email: "maria.silva@example.com",
        phone: "11999999999",
        address: "Rua Augusta, 123 - São Paulo - SP",
      },
    );

    const patients = await listPatients({
      practiceId: auth.practice.id,
      userId: auth.user.id,
    });

    expect(patients[0]).toMatchObject({
      name: "Maria Silva",
      email: "maria.silva@example.com",
      phone: "11999999999",
      address: "Rua Augusta, 123 - São Paulo - SP",
    });
  });
});
