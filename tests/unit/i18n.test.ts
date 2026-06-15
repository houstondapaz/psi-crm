import { describe, it, expect } from "vitest";
import { t, getWeekdayLabels } from "@/lib/i18n";

describe("t", () => {
  it("returns login title in pt-BR", () => {
    expect(t("login.title")).toBe("CRM Psi");
  });

  it("returns shared field labels from common", () => {
    expect(t("common.email")).toBe("E-mail");
    expect(t("common.password")).toBe("Senha");
  });

  it("interpolates values into messages", () => {
    expect(t("patients.registeredCount", { count: 3 })).toBe("3 cadastrados");
    expect(t("agenda.moreEvents", { count: 2 })).toBe("+2 mais");
  });
});

describe("getWeekdayLabels", () => {
  it("returns seven weekday abbreviations in pt-BR", () => {
    expect(getWeekdayLabels()).toEqual([
      "Seg",
      "Ter",
      "Qua",
      "Qui",
      "Sex",
      "Sáb",
      "Dom",
    ]);
  });
});
