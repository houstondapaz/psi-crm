export type AgendaView = "month" | "week" | "day";

export type AgendaEvent = {
  id: string;
  type: "reminder" | "session";
  patientId: string;
  patientName: string;
  title: string;
  startsAt: string;
  href: string;
};

export function parseAgendaDate(value: string | undefined) {
  if (!value) {
    return startOfDay(new Date());
  }
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return startOfDay(new Date());
  }
  return startOfDay(parsed);
}

export function parseAgendaView(value: string | undefined): AgendaView {
  if (value === "week" || value === "day") {
    return value;
  }
  return "month";
}

export function formatAgendaDateParam(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function endOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

function startOfWeek(date: Date) {
  const result = startOfDay(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  return result;
}

function endOfWeek(date: Date) {
  const result = startOfWeek(date);
  result.setDate(result.getDate() + 6);
  return endOfDay(result);
}

export function getAgendaRange(view: AgendaView, anchor: Date) {
  if (view === "day") {
    return { start: startOfDay(anchor), end: endOfDay(anchor) };
  }

  if (view === "week") {
    return { start: startOfWeek(anchor), end: endOfWeek(anchor) };
  }

  const firstOfMonth = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const lastOfMonth = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
  return {
    start: startOfWeek(firstOfMonth),
    end: endOfWeek(lastOfMonth),
  };
}

export function getAgendaTitle(view: AgendaView, anchor: Date) {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  });

  if (view === "day") {
    return anchor.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (view === "week") {
    const rangeStart = startOfWeek(anchor);
    const rangeEnd = endOfWeek(anchor);
    const startLabel = rangeStart.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
    });
    const endLabel = rangeEnd.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `${startLabel} – ${endLabel}`;
  }

  const label = formatter.format(anchor);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function buildMonthGrid(anchor: Date) {
  const { start, end } = getAgendaRange("month", anchor);
  const days: Date[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

export function buildWeekDays(anchor: Date) {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function eventsForDay(events: AgendaEvent[], day: Date) {
  return events.filter((event) => isSameDay(new Date(event.startsAt), day));
}
