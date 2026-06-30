import { describe, it, expect } from "vitest";
import { t, getLabelColorLabel, getSessionStatusLabel, getWeekdayLabels } from "@/lib/i18n";
import { LABEL_COLORS } from "@/lib/label-colors";

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

describe("getLabelColorLabel", () => {
  it("returns a pt-BR label for every label color", () => {
    for (const color of LABEL_COLORS) {
      expect(getLabelColorLabel(color)).toBeTruthy();
    }
    expect(getLabelColorLabel("slate")).toBeTruthy();
  });
});

describe("getSessionStatusLabel", () => {
  it("returns pt-BR labels for known session statuses", () => {
    expect(getSessionStatusLabel("scheduled")).toBe("Agendada");
    expect(getSessionStatusLabel("completed")).toBe("Realizada");
  });

  it("falls back to the raw status for unknown values", () => {
    expect(getSessionStatusLabel("unknown")).toBe("unknown");
  });
});
