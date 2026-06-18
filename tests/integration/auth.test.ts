import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resetDatabase } from "../helpers/db";
import { authenticateUser, registerPractice } from "@/services/auth-service";

describe("registerPractice", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalRegistrationToken = process.env.REGISTRATION_TOKEN;

  beforeEach(async () => {
    process.env.NODE_ENV = originalNodeEnv;
    if (originalRegistrationToken === undefined) {
      delete process.env.REGISTRATION_TOKEN;
    } else {
      process.env.REGISTRATION_TOKEN = originalRegistrationToken;
    }
    await resetDatabase();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    if (originalRegistrationToken === undefined) {
      delete process.env.REGISTRATION_TOKEN;
    } else {
      process.env.REGISTRATION_TOKEN = originalRegistrationToken;
    }
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

  it("requires the registration token in production", async () => {
    process.env.NODE_ENV = "production";
    process.env.REGISTRATION_TOKEN = "setup-token";

    await expect(
      registerPractice({
        practiceName: "Consultório Esperança",
        userName: "Dra. Ana",
        email: "ana@example.com",
        password: "senha-segura",
      }),
    ).rejects.toThrow("Invalid registration token");

    const result = await registerPractice({
      practiceName: "Consultório Esperança",
      userName: "Dra. Ana",
      email: "ana@example.com",
      password: "senha-segura",
      registrationToken: "setup-token",
    });

    expect(result.user.email).toBe("ana@example.com");
  });
});
