import { AppError } from "@/lib/errors";
import { db } from "@/prisma/db";
import type { AuthContext } from "./types";
import { asEntityId } from "./types";

export type CreateAnnotationInput = {
  sessionId: string;
  content: string;
  recordedAt?: Date;
};

export type UpdateAnnotationInput = {
  annotationId: string;
  content: string;
  recordedAt: Date;
};

async function getSessionForPractice(auth: AuthContext, sessionId: string) {
  return db.orm.Session
    .where((s) => s.id.eq(asEntityId(sessionId)))
    .where((s) => s.practiceId.eq(auth.practiceId))
    .first();
}

export async function createAnnotation(auth: AuthContext, input: CreateAnnotationInput) {
  const session = await getSessionForPractice(auth, input.sessionId);
  if (!session) {
    throw new AppError("errors.sessionNotFound");
  }

  const now = new Date();
  return db.orm.SessionAnnotation.create({
    id: asEntityId(crypto.randomUUID()),
    practiceId: auth.practiceId,
    sessionId: input.sessionId,
    content: input.content,
    recordedAt: input.recordedAt ?? now,
    createdAt: now,
  });
}

export async function listAnnotationsBySession(auth: AuthContext, sessionId: string) {
  return db.orm.SessionAnnotation
    .where((a) => a.sessionId.eq(sessionId))
    .where((a) => a.practiceId.eq(auth.practiceId))
    .orderBy((a) => a.recordedAt.asc())
    .all();
}

export async function updateAnnotation(auth: AuthContext, input: UpdateAnnotationInput) {
  const annotation = await db.orm.SessionAnnotation
    .where((a) => a.id.eq(asEntityId(input.annotationId)))
    .where((a) => a.practiceId.eq(auth.practiceId))
    .update({
      content: input.content,
      recordedAt: input.recordedAt,
    });

  if (!annotation) {
    throw new AppError("errors.annotationNotFound");
  }

  return annotation;
}

export async function deleteAnnotation(auth: AuthContext, annotationId: string) {
  const deleted = await db.orm.SessionAnnotation
    .where((a) => a.id.eq(asEntityId(annotationId)))
    .where((a) => a.practiceId.eq(auth.practiceId))
    .delete();

  if (!deleted) {
    throw new AppError("errors.annotationNotFound");
  }
}
