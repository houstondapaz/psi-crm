import { describe, it, expect, beforeEach } from "vitest";
import { resetDatabase } from "../helpers/db";
import { registerPractice } from "@/services/auth-service";
import { createPatient } from "@/services/patient-service";
import { createSession } from "@/services/session-service";
import {
  createProduct,
  createReferral,
  deleteReferral,
  markReferralSold,
} from "@/services/product-service";

describe("ProductService", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("creates referral on session and marks as sold", async () => {
    const { practice, user } = await registerPractice({
      practiceName: "Consultório",
      userName: "Dra. Ana",
      email: "ana@example.com",
      password: "senha123",
    });
    const auth = { practiceId: practice.id, userId: user.id };
    const patient = await createPatient(auth, { name: "Carlos" });
    const product = await createProduct(auth, {
      name: "Livro: Ansiedade Zero",
    });
    const session = await createSession(auth, {
      patientId: patient.id,
    });

    const referral = await createReferral(auth, {
      sessionId: session.id,
      patientId: patient.id,
      productId: product.id,
    });

    expect(referral.sold).toBe(false);

    const sold = await markReferralSold(auth, referral.id);
    expect(sold.sold).toBe(true);
    expect(sold.soldAt).toBeTruthy();
  });

  it("deletes referral", async () => {
    const { practice, user } = await registerPractice({
      practiceName: "Consultório",
      userName: "Dra. Ana",
      email: "ana2@example.com",
      password: "senha123",
    });
    const auth = { practiceId: practice.id, userId: user.id };
    const patient = await createPatient(auth, { name: "Carlos" });
    const product = await createProduct(auth, { name: "Livro" });
    const session = await createSession(auth, { patientId: patient.id });
    const referral = await createReferral(auth, {
      sessionId: session.id,
      patientId: patient.id,
      productId: product.id,
    });

    await deleteReferral(auth, referral.id);
  });
});
