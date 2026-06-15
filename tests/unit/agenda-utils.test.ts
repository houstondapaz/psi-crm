import { describe, it, expect } from "vitest";
import { getAgendaTitle } from "@/lib/agenda-utils";

describe("getAgendaTitle", () => {
  it("formats month view title in pt-BR", () => {
    const anchor = new Date("2026-06-15T12:00:00");
    expect(getAgendaTitle("month", anchor)).toBe("Junho de 2026");
  });
});
