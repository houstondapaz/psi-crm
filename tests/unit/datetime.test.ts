import { describe, it, expect } from "vitest";
import {
  formatLocalTime,
  getLocalDateKey,
  toDatetimeLocalValue,
} from "@/lib/datetime";
import { eventsForDay, formatAgendaDateParam } from "@/lib/agenda-utils";
import type { AgendaEvent } from "@/lib/agenda-utils";

describe("datetime helpers", () => {
  it("converts instants to datetime-local values in local timezone", () => {
    const date = new Date("2026-06-20T14:30:00Z");
    const localValue = toDatetimeLocalValue(date);
    const expectedHours = String(date.getHours()).padStart(2, "0");
    const expectedMinutes = String(date.getMinutes()).padStart(2, "0");

    expect(localValue).toContain("2026-06-20");
    expect(localValue).toContain(`${expectedHours}:${expectedMinutes}`);
  });

  it("formats local time from ISO strings", () => {
    const date = new Date("2026-06-20T14:30:00Z");
    const formatted = formatLocalTime(date);
    const expected = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    expect(formatted).toBe(expected);
  });

  it("groups agenda events by local calendar day", () => {
    const day = new Date("2026-06-20T12:00:00");
    const events: AgendaEvent[] = [
      {
        id: "1",
        type: "session",
        patientId: "p1",
        patientName: "Ana",
        title: "Sessão",
        startsAt: new Date(day.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        href: "/sessions/1",
      },
    ];

    expect(getLocalDateKey(events[0]!.startsAt)).toBe(formatAgendaDateParam(day));
    expect(eventsForDay(events, day)).toHaveLength(1);
  });
});
