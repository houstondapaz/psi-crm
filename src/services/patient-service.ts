import { db } from "@/prisma/db";
import type { LabelView } from "@/services/label-service";
import {
  filterByAllLabels,
  listPatientLabelsMap,
} from "@/services/label-service";
import type { AuthContext } from "./types";
import { asEntityId } from "./types";
import { AppError } from "@/lib/errors";

export type CreatePatientInput = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
};

export type UpdatePatientInput = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
};

export type PatientListItem = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: Date;
  labels: LabelView[];
};

export type ListPatientsOptions = {
  labelIds?: string[];
};

export async function createPatient(auth: AuthContext, input: CreatePatientInput) {
  const now = new Date();
  return db.orm.Patient.create({
    id: asEntityId(crypto.randomUUID()),
    practiceId: auth.practiceId,
    name: input.name,
    email: input.email ?? null,
    phone: input.phone ?? null,
    address: input.address ?? null,
    createdAt: now,
  });
}

export async function listPatients(
  auth: AuthContext,
  options?: ListPatientsOptions,
): Promise<PatientListItem[]> {
  const [patients, labelsMap] = await Promise.all([
    db.orm.Patient
      .where((p) => p.practiceId.eq(auth.practiceId))
      .orderBy((p) => p.name.asc())
      .all(),
    listPatientLabelsMap(auth),
  ]);

  const items = patients.map((patient) => ({
    ...patient,
    labels: labelsMap.get(patient.id) ?? [],
  }));

  return filterByAllLabels(items, options?.labelIds);
}

export async function getPatientById(auth: AuthContext, patientId: string) {
  return db.orm.Patient
    .where((p) => p.id.eq(asEntityId(patientId)))
    .where((p) => p.practiceId.eq(auth.practiceId))
    .first();
}

export async function updatePatient(
  auth: AuthContext,
  patientId: string,
  input: UpdatePatientInput,
) {
  const existing = await getPatientById(auth, patientId);
  if (!existing) {
    throw new AppError("errors.patientNotFound");
  }

  const updated = await db.orm.Patient
    .where((p) => p.id.eq(asEntityId(patientId)))
    .where((p) => p.practiceId.eq(auth.practiceId))
    .update({
      name: input.name.trim(),
      email: input.email ?? null,
      phone: input.phone ?? null,
      address: input.address ?? null,
    });

  if (!updated) {
    throw new AppError("errors.patientNotFound");
  }

  return updated;
}

export async function deletePatient(auth: AuthContext, patientId: string) {
  const deleted = await db.orm.Patient
    .where((p) => p.id.eq(asEntityId(patientId)))
    .where((p) => p.practiceId.eq(auth.practiceId))
    .delete();

  if (!deleted) {
    throw new AppError("errors.patientNotFound");
  }
}
