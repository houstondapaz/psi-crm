import { db } from "@/prisma/db";
import type { AuthContext } from "./types";
import { asEntityId } from "./types";
import { getPatientById } from "./patient-service";

export type CreateReminderInput = {
  patientId: string;
  targetDate: string;
  description?: string;
};

export type ResolveReminderAsContactInput = {
  reminderId: string;
  type: string;
  description?: string;
  occurredAt?: Date;
};

export async function createReminder(auth: AuthContext, input: CreateReminderInput) {
  const patient = await getPatientById(auth, input.patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  const now = new Date();
  return db.orm.Reminder.create({
    id: asEntityId(crypto.randomUUID()),
    practiceId: auth.practiceId,
    patientId: input.patientId,
    description: input.description ?? null,
    targetDate: new Date(`${input.targetDate}T00:00:00.000Z`),
    status: "pending",
    resolvedAt: null,
    createdAt: now,
  });
}

export async function resolveReminderAsContact(
  auth: AuthContext,
  input: ResolveReminderAsContactInput,
) {
  const reminder = await db.orm.Reminder
    .where((r) => r.id.eq(asEntityId(input.reminderId)))
    .where((r) => r.practiceId.eq(auth.practiceId))
    .first();

  if (!reminder) {
    throw new Error("Reminder not found");
  }

  const now = input.occurredAt ?? new Date();
  const contact = await db.orm.Contact.create({
    id: asEntityId(crypto.randomUUID()),
    practiceId: auth.practiceId,
    patientId: reminder.patientId,
    type: input.type,
    description: input.description ?? reminder.description,
    occurredAt: now,
    createdAt: now,
  });

  const updatedReminder = await db.orm.Reminder
    .where((r) => r.id.eq(reminder.id))
    .update({ status: "resolved", resolvedAt: now });

  return { contact, reminder: updatedReminder };
}

export async function listContactsByPatient(auth: AuthContext, patientId: string) {
  return db.orm.Contact
    .where((c) => c.patientId.eq(patientId))
    .where((c) => c.practiceId.eq(auth.practiceId))
    .orderBy((c) => c.occurredAt.desc())
    .all();
}

export async function listRemindersByPatient(auth: AuthContext, patientId: string) {
  return db.orm.Reminder
    .where((r) => r.patientId.eq(patientId))
    .where((r) => r.practiceId.eq(auth.practiceId))
    .orderBy((r) => r.targetDate.asc())
    .all();
}
