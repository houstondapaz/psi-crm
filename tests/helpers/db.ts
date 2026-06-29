import { db } from "@/prisma/db";

const deleteOrder = [
  db.orm.FileLink,
  db.orm.Referral,
  db.orm.SessionAnnotation,
  db.orm.PatientAnnotation,
  db.orm.SessionLabel,
  db.orm.PatientLabel,
  db.orm.Reminder,
  db.orm.Contact,
  db.orm.Session,
  db.orm.Patient,
  db.orm.Product,
  db.orm.Label,
  db.orm.User,
  db.orm.Practice,
] as const;

export async function resetDatabase() {
  for (const model of deleteOrder) {
    const rows = await model.all();
    for (const row of rows) {
      if ("patientId" in row && "labelId" in row) {
        await db.orm.PatientLabel.where({
          patientId: row.patientId,
          labelId: row.labelId,
        }).delete();
        continue;
      }
      if ("sessionId" in row && "labelId" in row) {
        await db.orm.SessionLabel.where({
          sessionId: row.sessionId,
          labelId: row.labelId,
        }).delete();
        continue;
      }
      await model.where({ id: row.id }).delete();
    }
  }
}

export { db };
