import { describe, it, expect, beforeEach } from "vitest";
import { resetDatabase } from "../helpers/db";
import { authenticateUser, registerPractice } from "@/services/auth-service";

describe("registerPractice", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("creates practice and user with hashed password", async () => {
    const result = await registerPractice({
      practiceName: "Consultório Esperança",
      userName: "Dra. Ana",
      email: "ana@example.com",
      password: "senha-segura",
    });

    expect(result.practice.name).toBe("Consultório Esperança");
    expect(result.user.email).toBe("ana@example.com");
    expect(result.user.practiceId).toBe(result.practice.id);

    const auth = await authenticateUser("ana@example.com", "senha-segura");
    expect(auth?.id).toBe(result.user.id);
    expect(auth?.practiceId).toBe(result.practice.id);
  });
});
