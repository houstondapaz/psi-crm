export const PATIENT_STATUSES = ["lead", "patient"] as const;

export type PatientStatus = (typeof PATIENT_STATUSES)[number];

export function isPatientStatus(value: string): value is PatientStatus {
  return (PATIENT_STATUSES as readonly string[]).includes(value);
}
