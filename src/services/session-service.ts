import { AppError } from "@/lib/errors";
import { db } from "@/prisma/db";
import type { LabelView } from "@/services/label-service";
import {
  filterByAllLabels,
  listSessionLabelsMap,
} from "@/services/label-service";
import type { AuthContext } from "./types";
import { asEntityId } from "./types";
import { requireActivePatient } from "./patient-service";
import { listAnnotationsBySession } from "./session-annotation-service";
import { listReferralsBySession } from "@/services/product-service";

export type CreateSessionInput = {
  patientId: string;
  occurredAt?: Date;
};

export type ScheduleSessionInput = {
  patientId: string;
  scheduledAt: Date;
};

export type UpdateSessionInput = {
  status?: string;
  scheduledAt?: Date | null;
  occurredAt?: Date | null;
};

export type SessionListItem = {
  id: string;
  patientName: string;
  status: string;
  displayDate: Date | null;
  scheduledAt: Date | null;
  occurredAt: Date | null;
  labels: LabelView[];
};

export type ListAllSessionsOptions = {
  labelIds?: string[];
  patientId?: string;
};

export type SessionDetail = {
  id: string;
  patientId: string;
  patientName: string;
  status: string;
  scheduledAt: Date | null;
  occurredAt: Date | null;
  createdAt: Date;
  annotations: Awaited<ReturnType<typeof listAnnotationsBySession>>;
  fileLinks: Awaited<ReturnType<typeof listFileLinksBySession>>;
  referrals: Awaited<ReturnType<typeof listReferralsBySession>>;
};

async function getSessionForPractice(auth: AuthContext, sessionId: string) {
  return db.orm.Session
    .where((s) => s.id.eq(asEntityId(sessionId)))
    .where((s) => s.practiceId.eq(auth.practiceId))
    .first();
}

export async function createSession(auth: AuthContext, input: CreateSessionInput) {
  await requireActivePatient(auth, input.patientId);

  const now = new Date();
  return db.orm.Session.create({
    id: asEntityId(crypto.randomUUID()),
    practiceId: auth.practiceId,
    patientId: input.patientId,
    scheduledAt: null,
    occurredAt: input.occurredAt ?? now,
    status: "completed",
    createdAt: now,
  });
}

export async function scheduleSession(auth: AuthContext, input: ScheduleSessionInput) {
  await requireActivePatient(auth, input.patientId);

  const now = new Date();
  return db.orm.Session.create({
    id: asEntityId(crypto.randomUUID()),
    practiceId: auth.practiceId,
    patientId: input.patientId,
    scheduledAt: input.scheduledAt,
    occurredAt: null,
    status: "scheduled",
    createdAt: now,
  });
}

export async function listSessionsByPatient(
  auth: AuthContext,
  patientId: string,
  options?: Pick<ListAllSessionsOptions, "labelIds">,
) {
  return listAllSessions(auth, { ...options, patientId });
}

export async function listAllSessions(
  auth: AuthContext,
  options?: ListAllSessionsOptions,
): Promise<SessionListItem[]> {
  const patientId = options?.patientId;
  const baseQuery = db.orm.Session.where((s) => s.practiceId.eq(auth.practiceId));
  const sessionsQuery = patientId
    ? baseQuery.where((s) => s.patientId.eq(patientId))
    : baseQuery;

  const [sessions, labelsMap] = await Promise.all([
    sessionsQuery.include("patient", (p) => p.select("name")).all(),
    listSessionLabelsMap(auth),
  ]);

  const items = sessions
    .map((session) => ({
      id: session.id,
      patientName: session.patient.name,
      status: session.status,
      displayDate: session.occurredAt ?? session.scheduledAt ?? null,
      scheduledAt: session.scheduledAt,
      occurredAt: session.occurredAt,
      labels: labelsMap.get(session.id) ?? [],
    }))
    .sort((a, b) => {
      const aTime = a.displayDate?.getTime() ?? 0;
      const bTime = b.displayDate?.getTime() ?? 0;
      return bTime - aTime;
    });

  return filterByAllLabels(items, options?.labelIds);
}

export async function getSessionById(
  auth: AuthContext,
  sessionId: string,
): Promise<SessionDetail | null> {
  const session = await db.orm.Session
    .where((s) => s.id.eq(asEntityId(sessionId)))
    .where((s) => s.practiceId.eq(auth.practiceId))
    .include("patient", (p) => p.select("id", "name"))
    .first();

  if (!session) {
    return null;
  }

  const [annotations, fileLinks, referrals] = await Promise.all([
    listAnnotationsBySession(auth, sessionId),
    listFileLinksBySession(auth, sessionId),
    listReferralsBySession(auth, sessionId),
  ]);

  return {
    id: session.id,
    patientId: session.patientId,
    patientName: session.patient.name,
    status: session.status,
    scheduledAt: session.scheduledAt,
    occurredAt: session.occurredAt,
    createdAt: session.createdAt,
    annotations,
    fileLinks,
    referrals,
  };
}

export async function updateSession(
  auth: AuthContext,
  sessionId: string,
  input: UpdateSessionInput,
) {
  const existing = await getSessionForPractice(auth, sessionId);
  if (!existing) {
    throw new AppError("errors.sessionNotFound");
  }

  const updated = await db.orm.Session
    .where((s) => s.id.eq(asEntityId(sessionId)))
    .where((s) => s.practiceId.eq(auth.practiceId))
    .update({
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.scheduledAt !== undefined ? { scheduledAt: input.scheduledAt } : {}),
      ...(input.occurredAt !== undefined ? { occurredAt: input.occurredAt } : {}),
    });

  if (!updated) {
    throw new AppError("errors.sessionNotFound");
  }

  return updated;
}

export async function cancelSession(auth: AuthContext, sessionId: string) {
  const existing = await getSessionForPractice(auth, sessionId);
  if (!existing) {
    throw new AppError("errors.sessionNotFound");
  }
  if (existing.status !== "scheduled") {
    throw new AppError("errors.sessionNotScheduled");
  }

  const updated = await db.orm.Session
    .where((s) => s.id.eq(asEntityId(sessionId)))
    .where((s) => s.practiceId.eq(auth.practiceId))
    .update({ status: "cancelled" });

  if (!updated) {
    throw new AppError("errors.sessionNotFound");
  }

  return updated;
}

export async function deleteSession(auth: AuthContext, sessionId: string) {
  const deleted = await db.orm.Session
    .where((s) => s.id.eq(asEntityId(sessionId)))
    .where((s) => s.practiceId.eq(auth.practiceId))
    .delete();

  if (!deleted) {
    throw new AppError("errors.sessionNotFound");
  }
}

export async function rescheduleSession(
  auth: AuthContext,
  sessionId: string,
  date: Date,
) {
  const existing = await getSessionForPractice(auth, sessionId);
  if (!existing) {
    throw new AppError("errors.sessionNotFound");
  }

  if (existing.status === "completed") {
    return updateSession(auth, sessionId, { occurredAt: date });
  }

  return updateSession(auth, sessionId, { scheduledAt: date });
}

export async function addFileLink(
  auth: AuthContext,
  sessionId: string,
  input: { label: string; url: string },
) {
  const session = await getSessionForPractice(auth, sessionId);
  if (!session) {
    throw new AppError("errors.sessionNotFound");
  }

  return db.orm.FileLink.create({
    id: asEntityId(crypto.randomUUID()),
    practiceId: auth.practiceId,
    sessionId,
    label: input.label,
    url: input.url,
    createdAt: new Date(),
  });
}

export async function listFileLinksBySession(auth: AuthContext, sessionId: string) {
  return db.orm.FileLink
    .where((f) => f.sessionId.eq(sessionId))
    .where((f) => f.practiceId.eq(auth.practiceId))
    .all();
}

export async function updateFileLink(
  auth: AuthContext,
  fileLinkId: string,
  input: { label: string; url: string },
) {
  const updated = await db.orm.FileLink
    .where((f) => f.id.eq(asEntityId(fileLinkId)))
    .where((f) => f.practiceId.eq(auth.practiceId))
    .update({
      label: input.label,
      url: input.url,
    });

  if (!updated) {
    throw new AppError("errors.fileLinkNotFound");
  }

  return updated;
}

export async function deleteFileLink(auth: AuthContext, fileLinkId: string) {
  const deleted = await db.orm.FileLink
    .where((f) => f.id.eq(asEntityId(fileLinkId)))
    .where((f) => f.practiceId.eq(auth.practiceId))
    .delete();

  if (!deleted) {
    throw new AppError("errors.fileLinkNotFound");
  }
}
