import { describe, it, expect } from "vitest";
import { t } from "@/lib/i18n";

describe("t", () => {
  it("returns login title in pt-BR", () => {
    expect(t("login.title")).toBe("CRM Psi");
  });

  it("returns shared field labels from common", () => {
    expect(t("common.email")).toBe("E-mail");
    expect(t("common.password")).toBe("Senha");
  });
});
