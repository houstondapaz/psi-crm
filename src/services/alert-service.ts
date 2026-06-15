import { db } from "@/prisma/db";
import { t } from "@/lib/i18n";
import type { AuthContext } from "./types";

export type AlertItem = {
  type: "reminder" | "session";
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  referenceDate: string;
  status: "overdue" | "upcoming";
};

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export async function listDueAlerts(
  auth: AuthContext,
  referenceDate = new Date(),
): Promise<AlertItem[]> {
  const today = formatDate(referenceDate);
  const inThreeDays = addDays(referenceDate, 3);

  const pendingReminders = await db.orm.Reminder
    .where((r) => r.practiceId.eq(auth.practiceId))
    .where((r) => r.status.eq("pending"))
    .where((r) => r.targetDate.lte(inThreeDays))
    .include("patient", (p) => p.select("id", "name"))
    .all();

  const scheduledSessions = await db.orm.Session
    .where((s) => s.practiceId.eq(auth.practiceId))
    .where((s) => s.status.eq("scheduled"))
    .where((s) => s.scheduledAt.lte(addDays(referenceDate, 3)))
    .include("patient", (p) => p.select("id", "name"))
    .all();

  const reminderAlerts: AlertItem[] = pendingReminders.map((item) => {
    const targetDate = formatDate(new Date(item.targetDate));
    return {
      type: "reminder" as const,
      id: item.id,
      patientId: item.patientId,
      patientName: item.patient.name,
      title: item.description ?? t("common.defaultReminder"),
      referenceDate: targetDate,
      status: targetDate <= today ? "overdue" : "upcoming",
    };
  });

  const sessionAlerts: AlertItem[] = scheduledSessions
    .filter((item) => item.scheduledAt)
    .map((item) => {
      const scheduledAt = new Date(item.scheduledAt!);
      const scheduledDate = formatDate(scheduledAt);
      return {
        type: "session" as const,
        id: item.id,
        patientId: item.patientId,
        patientName: item.patient.name,
        title: t("common.scheduledSession"),
        referenceDate: scheduledDate,
        status: scheduledAt <= referenceDate ? "overdue" : "upcoming",
      };
    });

  return [...reminderAlerts, ...sessionAlerts].sort((a, b) =>
    a.referenceDate.localeCompare(b.referenceDate),
  );
}
