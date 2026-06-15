import { db } from "@/prisma/db";
import type { AuthContext } from "./types";
import { asEntityId } from "./types";

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

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
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
      title: item.description ?? "Retomar contato",
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
        title: "Sessão agendada",
        referenceDate: scheduledDate,
        status: scheduledAt <= referenceDate ? "overdue" : "upcoming",
      };
    });

  return [...reminderAlerts, ...sessionAlerts].sort((a, b) =>
    a.referenceDate.localeCompare(b.referenceDate),
  );
}

export type EmailSender = (input: {
  to: string;
  subject: string;
  body: string;
}) => Promise<void>;

export async function notifyAlertsByEmail(
  auth: AuthContext,
  sendEmail: EmailSender,
  referenceDate = new Date(),
) {
  const user = await db.orm.User
    .where((u) => u.id.eq(auth.userId))
    .where((u) => u.practiceId.eq(auth.practiceId))
    .first();

  if (!user) {
    throw new Error("User not found");
  }

  const alerts = await listDueAlerts(auth, referenceDate);
  const sent: AlertItem[] = [];
  const dayStart = startOfDay(referenceDate);
  const dayEnd = endOfDay(referenceDate);

  for (const alert of alerts) {
    const existing = await db.orm.SentAlertEmail
      .where({
        practiceId: auth.practiceId,
        referenceType: alert.type,
        referenceId: alert.id,
      })
      .where((e) => e.sentAt.gte(dayStart))
      .where((e) => e.sentAt.lte(dayEnd))
      .first();

    if (existing) {
      continue;
    }

    await sendEmail({
      to: user.email,
      subject: `[CRM Psi] ${alert.status === "overdue" ? "Vencido" : "Próximo"}: ${alert.title}`,
      body: `Paciente: ${alert.patientName}\nData: ${alert.referenceDate}\nTipo: ${alert.type}`,
    });

    await db.orm.SentAlertEmail.create({
      id: asEntityId(crypto.randomUUID()),
      practiceId: auth.practiceId,
      userId: auth.userId,
      referenceType: alert.type,
      referenceId: alert.id,
      sentAt: referenceDate,
    });

    sent.push(alert);
  }

  return sent;
}
