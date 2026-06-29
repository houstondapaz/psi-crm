import { AppError } from "@/lib/errors";
import { db } from "@/prisma/db";
import type { AuthContext } from "./types";
import { asEntityId } from "./types";

export type CreatePatientAnnotationInput = {
  patientId: string;
  content: string;
  recordedAt?: Date;
};

export type UpdatePatientAnnotationInput = {
  annotationId: string;
  content: string;
  recordedAt: Date;
};

async function getPatientForPractice(auth: AuthContext, patientId: string) {
  return db.orm.Patient
    .where((p) => p.id.eq(asEntityId(patientId)))
    .where((p) => p.practiceId.eq(auth.practiceId))
    .first();
}

export async function createPatientAnnotation(
  auth: AuthContext,
  input: CreatePatientAnnotationInput,
) {
  const patient = await getPatientForPractice(auth, input.patientId);
  if (!patient) {
    throw new AppError("errors.patientNotFound");
  }

  const now = new Date();
  return db.orm.PatientAnnotation.create({
    id: asEntityId(crypto.randomUUID()),
    practiceId: auth.practiceId,
    patientId: input.patientId,
    content: input.content,
    recordedAt: input.recordedAt ?? now,
    createdAt: now,
  });
}

export async function listAnnotationsByPatient(auth: AuthContext, patientId: string) {
  return db.orm.PatientAnnotation
    .where((a) => a.patientId.eq(patientId))
    .where((a) => a.practiceId.eq(auth.practiceId))
    .orderBy((a) => a.recordedAt.asc())
    .all();
}

export async function updatePatientAnnotation(
  auth: AuthContext,
  input: UpdatePatientAnnotationInput,
) {
  const annotation = await db.orm.PatientAnnotation
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

export async function deletePatientAnnotation(auth: AuthContext, annotationId: string) {
  const deleted = await db.orm.PatientAnnotation
    .where((a) => a.id.eq(asEntityId(annotationId)))
    .where((a) => a.practiceId.eq(auth.practiceId))
    .delete();

  if (!deleted) {
    throw new AppError("errors.annotationNotFound");
  }
}
