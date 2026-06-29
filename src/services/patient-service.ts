import { db } from "@/prisma/db";
import type { LabelView } from "@/services/label-service";
import {
  filterByAllLabels,
  listPatientLabelsMap,
} from "@/services/label-service";
import type { AuthContext } from "./types";
import { asEntityId } from "./types";
import { AppError } from "@/lib/errors";
import type { PatientStatus } from "@/lib/patient-status";

export type CreatePatientInput = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  status?: PatientStatus;
};

export type UpdatePatientInput = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
};

export type PatientListItem = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  status: PatientStatus;
  createdAt: Date;
  labels: LabelView[];
};

export type ListPatientsOptions = {
  labelIds?: string[];
  status?: PatientStatus;
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
    description: input.description ?? null,
    status: input.status ?? "patient",
    createdAt: now,
  });
}

export async function listPatients(
  auth: AuthContext,
  options?: ListPatientsOptions,
): Promise<PatientListItem[]> {
  let query = db.orm.Patient.where((p) => p.practiceId.eq(auth.practiceId));

  if (options?.status) {
    query = query.where((p) => p.status.eq(options.status!));
  }

  const [patients, labelsMap] = await Promise.all([
    query.orderBy((p) => p.name.asc()).all(),
    listPatientLabelsMap(auth),
  ]);

  const items = patients.map((patient) => ({
    ...patient,
    status: patient.status as PatientStatus,
    labels: labelsMap.get(patient.id) ?? [],
  }));

  return filterByAllLabels(items, options?.labelIds);
}

export async function getPatientById(auth: AuthContext, patientId: string) {
  const patient = await db.orm.Patient
    .where((p) => p.id.eq(asEntityId(patientId)))
    .where((p) => p.practiceId.eq(auth.practiceId))
    .first();

  if (!patient) {
    return null;
  }

  return {
    ...patient,
    status: patient.status as PatientStatus,
  };
}

export async function promotePatient(auth: AuthContext, patientId: string) {
  const existing = await getPatientById(auth, patientId);
  if (!existing) {
    throw new AppError("errors.patientNotFound");
  }
  if (existing.status !== "lead") {
    throw new AppError("errors.patientNotLead");
  }

  const updated = await db.orm.Patient
    .where((p) => p.id.eq(asEntityId(patientId)))
    .where((p) => p.practiceId.eq(auth.practiceId))
    .update({ status: "patient" });

  if (!updated) {
    throw new AppError("errors.patientNotFound");
  }

  return {
    ...updated,
    status: updated.status as PatientStatus,
  };
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
      description: input.description ?? null,
    });

  if (!updated) {
    throw new AppError("errors.patientNotFound");
  }

  return {
    ...updated,
    status: updated.status as PatientStatus,
  };
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

export async function requireActivePatient(auth: AuthContext, patientId: string) {
  const patient = await getPatientById(auth, patientId);
  if (!patient) {
    throw new AppError("errors.patientNotFound");
  }
  if (patient.status !== "patient") {
    throw new AppError("errors.leadCannotHaveSession");
  }
  return patient;
}
