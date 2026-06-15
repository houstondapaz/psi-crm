import { db } from "@/prisma/db";
import type { AuthContext } from "./types";
import type { AgendaEvent } from "@/lib/agenda-utils";

export type { AgendaEvent, AgendaView } from "@/lib/agenda-utils";
export {
  getAgendaRange,
  getAgendaTitle,
  parseAgendaDate,
  parseAgendaView,
} from "@/lib/agenda-utils";

export async function listAgendaEvents(
  auth: AuthContext,
  rangeStart: Date,
  rangeEnd: Date,
): Promise<AgendaEvent[]> {
  const [reminders, sessions] = await Promise.all([
    db.orm.Reminder
      .where((r) => r.practiceId.eq(auth.practiceId))
      .where((r) => r.status.eq("pending"))
      .where((r) => r.targetDate.gte(rangeStart))
      .where((r) => r.targetDate.lte(rangeEnd))
      .include("patient", (p) => p.select("id", "name"))
      .all(),
    db.orm.Session
      .where((s) => s.practiceId.eq(auth.practiceId))
      .where((s) => s.status.eq("scheduled"))
      .where((s) => s.scheduledAt.gte(rangeStart))
      .where((s) => s.scheduledAt.lte(rangeEnd))
      .include("patient", (p) => p.select("id", "name"))
      .all(),
  ]);

  const reminderEvents: AgendaEvent[] = reminders.map((item) => ({
    id: item.id,
    type: "reminder",
    patientId: item.patientId,
    patientName: item.patient.name,
    title: item.description ?? "Lembrete",
    startsAt: new Date(item.targetDate).toISOString(),
    href: `/patients/${item.patientId}`,
  }));

  const sessionEvents: AgendaEvent[] = sessions
    .filter((item) => item.scheduledAt)
    .map((item) => ({
      id: item.id,
      type: "session",
      patientId: item.patientId,
      patientName: item.patient.name,
      title: "Sessão agendada",
      startsAt: new Date(item.scheduledAt!).toISOString(),
      href: `/sessions/${item.id}`,
    }));

  return [...reminderEvents, ...sessionEvents].sort((a, b) =>
    a.startsAt.localeCompare(b.startsAt),
  );
}
