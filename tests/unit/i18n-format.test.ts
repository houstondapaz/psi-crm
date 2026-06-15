import { describe, it, expect } from "vitest";
import { formatDate, formatDateTime } from "@/lib/i18n/format";

describe("date formatters", () => {
  const date = new Date("2026-06-15T14:00:00");

  it("formats dates in pt-BR locale", () => {
    const formatted = formatDate(date, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    expect(formatted).toBe("15/06/2026");
  });

  it("formats date-times in pt-BR locale", () => {
    const formatted = formatDateTime(date, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    expect(formatted).toContain("15");
    expect(formatted).toContain("06");
    expect(formatted).toContain("2026");
    expect(formatted).toContain("14");
  });
});
