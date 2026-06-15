import { LOCALE } from "@/lib/i18n";
import { db } from "@/prisma/db";
import { isLabelColor, type LabelColor } from "@/lib/label-colors";
import type { AuthContext } from "./types";
import { asEntityId } from "./types";
import { getPatientById } from "./patient-service";

export type LabelView = {
  id: string;
  name: string;
  color: LabelColor;
};

export type CreateLabelInput = {
  name: string;
  color: string;
};

export type UpdateLabelInput = {
  name?: string;
  color?: string;
};

function assertLabelColor(color: string): LabelColor {
  if (!isLabelColor(color)) {
    throw new Error("Invalid label color");
  }
  return color;
}

function toLabelView(label: {
  id: string;
  name: string;
  color: string;
}): LabelView {
  return {
    id: label.id,
    name: label.name,
    color: assertLabelColor(label.color),
  };
}

async function getLabelForPractice(auth: AuthContext, labelId: string) {
  return db.orm.Label
    .where((l) => l.id.eq(asEntityId(labelId)))
    .where((l) => l.practiceId.eq(auth.practiceId))
    .first();
}

async function getSessionForPractice(auth: AuthContext, sessionId: string) {
  return db.orm.Session
    .where((s) => s.id.eq(asEntityId(sessionId)))
    .where((s) => s.practiceId.eq(auth.practiceId))
    .first();
}

export async function createLabel(auth: AuthContext, input: CreateLabelInput) {
  const name = input.name.trim();
  if (!name) {
    throw new Error("Label name is required");
  }

  const color = assertLabelColor(input.color);

  const existing = await db.orm.Label
    .where((l) => l.practiceId.eq(auth.practiceId))
    .where((l) => l.name.eq(name))
    .first();

  if (existing) {
    throw new Error("Label name already exists");
  }

  return db.orm.Label.create({
    id: asEntityId(crypto.randomUUID()),
    practiceId: auth.practiceId,
    name,
    color,
    createdAt: new Date(),
  });
}

export async function listLabels(auth: AuthContext): Promise<LabelView[]> {
  const labels = await db.orm.Label
    .where((l) => l.practiceId.eq(auth.practiceId))
    .orderBy((l) => l.name.asc())
    .all();

  return labels.map(toLabelView);
}

export async function updateLabel(
  auth: AuthContext,
  labelId: string,
  input: UpdateLabelInput,
) {
  const existing = await getLabelForPractice(auth, labelId);
  if (!existing) {
    throw new Error("Label not found");
  }

  const name = input.name !== undefined ? input.name.trim() : existing.name;
  if (!name) {
    throw new Error("Label name is required");
  }

  if (name !== existing.name) {
    const duplicate = await db.orm.Label
      .where((l) => l.practiceId.eq(auth.practiceId))
      .where((l) => l.name.eq(name))
      .first();

    if (duplicate) {
      throw new Error("Label name already exists");
    }
  }

  const color =
    input.color !== undefined ? assertLabelColor(input.color) : assertLabelColor(existing.color);

  const updated = await db.orm.Label
    .where((l) => l.id.eq(asEntityId(labelId)))
    .where((l) => l.practiceId.eq(auth.practiceId))
    .update({ name, color });

  if (!updated) {
    throw new Error("Label not found");
  }

  return updated;
}

export async function deleteLabel(auth: AuthContext, labelId: string) {
  const deleted = await db.orm.Label
    .where((l) => l.id.eq(asEntityId(labelId)))
    .where((l) => l.practiceId.eq(auth.practiceId))
    .delete();

  if (!deleted) {
    throw new Error("Label not found");
  }
}

export async function attachLabelToPatient(
  auth: AuthContext,
  patientId: string,
  labelId: string,
) {
  const [patient, label] = await Promise.all([
    getPatientById(auth, patientId),
    getLabelForPractice(auth, labelId),
  ]);

  if (!patient) {
    throw new Error("Patient not found");
  }
  if (!label) {
    throw new Error("Label not found");
  }

  const existing = await db.orm.PatientLabel
    .where((pl) => pl.patientId.eq(patientId))
    .where((pl) => pl.labelId.eq(labelId))
    .first();

  if (existing) {
    return existing;
  }

  return db.orm.PatientLabel.create({
    patientId,
    labelId,
  });
}

export async function detachLabelFromPatient(
  auth: AuthContext,
  patientId: string,
  labelId: string,
) {
  const patient = await getPatientById(auth, patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  const deleted = await db.orm.PatientLabel
    .where((pl) => pl.patientId.eq(patientId))
    .where((pl) => pl.labelId.eq(labelId))
    .delete();

  if (!deleted) {
    throw new Error("Label not attached to patient");
  }
}

export async function attachLabelToSession(
  auth: AuthContext,
  sessionId: string,
  labelId: string,
) {
  const [session, label] = await Promise.all([
    getSessionForPractice(auth, sessionId),
    getLabelForPractice(auth, labelId),
  ]);

  if (!session) {
    throw new Error("Session not found");
  }
  if (!label) {
    throw new Error("Label not found");
  }

  const existing = await db.orm.SessionLabel
    .where((sl) => sl.sessionId.eq(sessionId))
    .where((sl) => sl.labelId.eq(labelId))
    .first();

  if (existing) {
    return existing;
  }

  return db.orm.SessionLabel.create({
    sessionId,
    labelId,
  });
}

export async function detachLabelFromSession(
  auth: AuthContext,
  sessionId: string,
  labelId: string,
) {
  const session = await getSessionForPractice(auth, sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  const deleted = await db.orm.SessionLabel
    .where((sl) => sl.sessionId.eq(sessionId))
    .where((sl) => sl.labelId.eq(labelId))
    .delete();

  if (!deleted) {
    throw new Error("Label not attached to session");
  }
}

export async function listLabelsByPatient(
  auth: AuthContext,
  patientId: string,
): Promise<LabelView[]> {
  const patient = await getPatientById(auth, patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  const rows = await db.orm.PatientLabel
    .where((pl) => pl.patientId.eq(patientId))
    .include("label", (l) => l.select("id", "name", "color"))
    .all();

  return rows
    .map((row) => toLabelView(row.label))
    .sort((a, b) => a.name.localeCompare(b.name, LOCALE));
}

export async function listLabelsBySession(
  auth: AuthContext,
  sessionId: string,
): Promise<LabelView[]> {
  const session = await getSessionForPractice(auth, sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  const rows = await db.orm.SessionLabel
    .where((sl) => sl.sessionId.eq(sessionId))
    .include("label", (l) => l.select("id", "name", "color"))
    .all();

  return rows
    .map((row) => toLabelView(row.label))
    .sort((a, b) => a.name.localeCompare(b.name, LOCALE));
}

function matchesAllLabels(labelIds: string[], entityLabelIds: string[]) {
  const attached = new Set(entityLabelIds);
  return labelIds.every((labelId) => attached.has(labelId));
}

export async function listPatientLabelsMap(auth: AuthContext) {
  const rows = await db.orm.PatientLabel
    .include("label", (l) => l.select("id", "name", "color"))
    .include("patient", (p) => p.select("id", "practiceId"))
    .all();

  const map = new Map<string, LabelView[]>();

  for (const row of rows) {
    if (row.patient.practiceId !== auth.practiceId) {
      continue;
    }
    const labels = map.get(row.patientId) ?? [];
    labels.push(toLabelView(row.label));
    map.set(row.patientId, labels);
  }

  for (const [patientId, labels] of map) {
    map.set(
      patientId,
      labels.sort((a, b) => a.name.localeCompare(b.name, LOCALE)),
    );
  }

  return map;
}

export async function listSessionLabelsMap(auth: AuthContext) {
  const rows = await db.orm.SessionLabel
    .include("label", (l) => l.select("id", "name", "color"))
    .include("session", (s) => s.select("id", "practiceId"))
    .all();

  const map = new Map<string, LabelView[]>();

  for (const row of rows) {
    if (row.session.practiceId !== auth.practiceId) {
      continue;
    }
    const labels = map.get(row.sessionId) ?? [];
    labels.push(toLabelView(row.label));
    map.set(row.sessionId, labels);
  }

  for (const [sessionId, labels] of map) {
    map.set(
      sessionId,
      labels.sort((a, b) => a.name.localeCompare(b.name, LOCALE)),
    );
  }

  return map;
}

export function filterByAllLabels<T extends { labels: LabelView[] }>(
  items: T[],
  labelIds?: string[],
) {
  if (!labelIds?.length) {
    return items;
  }

  return items.filter((item) =>
    matchesAllLabels(
      labelIds,
      item.labels.map((label) => label.id),
    ),
  );
}
