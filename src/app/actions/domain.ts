"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/session";
import { createPatient } from "@/services/patient-service";
import { createReminder, resolveReminderAsContact } from "@/services/reminder-service";
import {
  createAnnotation,
  deleteAnnotation,
  updateAnnotation,
} from "@/services/session-annotation-service";
import {
  addFileLink,
  createSession,
  deleteFileLink,
  scheduleSession,
  updateFileLink,
  updateSession,
} from "@/services/session-service";
import {
  createProduct,
  createReferral,
  deleteReferral,
  markReferralSold,
} from "@/services/product-service";
import {
  attachLabelToPatient,
  attachLabelToSession,
  createLabel,
  deleteLabel,
  detachLabelFromPatient,
  detachLabelFromSession,
  updateLabel,
} from "@/services/label-service";

function revalidateSessionPaths(sessionId: string) {
  revalidatePath(`/sessions/${sessionId}`);
  revalidatePath("/sessions");
  revalidatePath("/dashboard");
}

export async function createPatientAction(formData: FormData) {
  const auth = await requireAuth();
  await createPatient(auth, {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? "") || undefined,
    phone: String(formData.get("phone") ?? "") || undefined,
  });
  revalidatePath("/patients");
}

export async function createSessionAction(formData: FormData) {
  const auth = await requireAuth();
  const patientId = String(formData.get("patientId") ?? "");
  const session = await createSession(auth, { patientId });
  revalidatePath(`/patients/${patientId}`);
  revalidatePath("/sessions");
  redirect(`/sessions/${session.id}`);
}

export async function scheduleSessionAction(formData: FormData) {
  const auth = await requireAuth();
  const patientId = String(formData.get("patientId") ?? "");
  const session = await scheduleSession(auth, {
    patientId,
    scheduledAt: new Date(String(formData.get("scheduledAt") ?? "")),
  });
  revalidatePath(`/patients/${patientId}`);
  revalidatePath("/dashboard");
  revalidatePath("/sessions");
  redirect(`/sessions/${session.id}`);
}

export async function updateSessionAction(formData: FormData) {
  const auth = await requireAuth();
  const sessionId = String(formData.get("sessionId") ?? "");
  const scheduledAtRaw = String(formData.get("scheduledAt") ?? "");
  const occurredAtRaw = String(formData.get("occurredAt") ?? "");

  await updateSession(auth, sessionId, {
    status: String(formData.get("status") ?? ""),
    scheduledAt: scheduledAtRaw ? new Date(scheduledAtRaw) : null,
    occurredAt: occurredAtRaw ? new Date(occurredAtRaw) : null,
  });

  revalidateSessionPaths(sessionId);
}

export async function createAnnotationAction(formData: FormData) {
  const auth = await requireAuth();
  const sessionId = String(formData.get("sessionId") ?? "");
  await createAnnotation(auth, {
    sessionId,
    content: String(formData.get("content") ?? ""),
  });
  revalidateSessionPaths(sessionId);
}

export async function updateAnnotationAction(formData: FormData) {
  const auth = await requireAuth();
  const sessionId = String(formData.get("sessionId") ?? "");
  await updateAnnotation(auth, {
    annotationId: String(formData.get("annotationId") ?? ""),
    content: String(formData.get("content") ?? ""),
    recordedAt: new Date(String(formData.get("recordedAt") ?? "")),
  });
  revalidateSessionPaths(sessionId);
}

export async function deleteAnnotationAction(formData: FormData) {
  const auth = await requireAuth();
  const sessionId = String(formData.get("sessionId") ?? "");
  await deleteAnnotation(auth, String(formData.get("annotationId") ?? ""));
  revalidateSessionPaths(sessionId);
}

export async function createReminderAction(formData: FormData) {
  const auth = await requireAuth();
  const patientId = String(formData.get("patientId") ?? "");
  await createReminder(auth, {
    patientId,
    targetDate: String(formData.get("targetDate") ?? ""),
    description: String(formData.get("description") ?? "") || undefined,
  });
  revalidatePath(`/patients/${patientId}`);
  revalidatePath("/dashboard");
}

export async function resolveReminderAction(formData: FormData) {
  const auth = await requireAuth();
  const patientId = String(formData.get("patientId") ?? "");
  await resolveReminderAsContact(auth, {
    reminderId: String(formData.get("reminderId") ?? ""),
    type: String(formData.get("type") ?? "whatsapp"),
    description: String(formData.get("description") ?? "") || undefined,
  });
  revalidatePath(`/patients/${patientId}`);
  revalidatePath("/dashboard");
}

export async function createProductAction(formData: FormData) {
  const auth = await requireAuth();
  await createProduct(auth, {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? "") || undefined,
  });
  revalidatePath("/products");
}

export async function createReferralAction(formData: FormData) {
  const auth = await requireAuth();
  const sessionId = String(formData.get("sessionId") ?? "");
  const patientId = String(formData.get("patientId") ?? "");
  await createReferral(auth, {
    sessionId,
    patientId,
    productId: String(formData.get("productId") ?? ""),
  });
  revalidateSessionPaths(sessionId);
  revalidatePath(`/patients/${patientId}`);
}

export async function markSoldAction(formData: FormData) {
  const auth = await requireAuth();
  const sessionId = String(formData.get("sessionId") ?? "");
  const patientId = String(formData.get("patientId") ?? "");
  await markReferralSold(auth, String(formData.get("referralId") ?? ""));
  if (sessionId) {
    revalidateSessionPaths(sessionId);
  }
  if (patientId) {
    revalidatePath(`/patients/${patientId}`);
  }
}

export async function deleteReferralAction(formData: FormData) {
  const auth = await requireAuth();
  const sessionId = String(formData.get("sessionId") ?? "");
  await deleteReferral(auth, String(formData.get("referralId") ?? ""));
  revalidateSessionPaths(sessionId);
}

export async function addFileLinkAction(formData: FormData) {
  const auth = await requireAuth();
  const sessionId = String(formData.get("sessionId") ?? "");
  await addFileLink(auth, sessionId, {
    label: String(formData.get("label") ?? ""),
    url: String(formData.get("url") ?? ""),
  });
  revalidateSessionPaths(sessionId);
  const patientId = String(formData.get("patientId") ?? "");
  if (patientId) {
    revalidatePath(`/patients/${patientId}`);
  }
}

export async function updateFileLinkAction(formData: FormData) {
  const auth = await requireAuth();
  const sessionId = String(formData.get("sessionId") ?? "");
  await updateFileLink(auth, String(formData.get("fileLinkId") ?? ""), {
    label: String(formData.get("label") ?? ""),
    url: String(formData.get("url") ?? ""),
  });
  revalidateSessionPaths(sessionId);
}

export async function deleteFileLinkAction(formData: FormData) {
  const auth = await requireAuth();
  const sessionId = String(formData.get("sessionId") ?? "");
  await deleteFileLink(auth, String(formData.get("fileLinkId") ?? ""));
  revalidateSessionPaths(sessionId);
}

function revalidatePatientPaths(patientId: string) {
  revalidatePath(`/patients/${patientId}`);
  revalidatePath("/patients");
}

export async function createLabelAction(formData: FormData) {
  const auth = await requireAuth();
  await createLabel(auth, {
    name: String(formData.get("name") ?? ""),
    color: String(formData.get("color") ?? "blue"),
  });
  revalidatePath("/labels");
}

export async function updateLabelAction(formData: FormData) {
  const auth = await requireAuth();
  const labelId = String(formData.get("labelId") ?? "");
  await updateLabel(auth, labelId, {
    name: String(formData.get("name") ?? ""),
    color: String(formData.get("color") ?? "blue"),
  });
  revalidatePath("/labels");
  revalidatePath("/patients");
  revalidatePath("/sessions");
}

export async function deleteLabelAction(formData: FormData) {
  const auth = await requireAuth();
  await deleteLabel(auth, String(formData.get("labelId") ?? ""));
  revalidatePath("/labels");
  revalidatePath("/patients");
  revalidatePath("/sessions");
}

export async function attachPatientLabelAction(formData: FormData) {
  const auth = await requireAuth();
  const patientId = String(formData.get("patientId") ?? "");
  await attachLabelToPatient(auth, patientId, String(formData.get("labelId") ?? ""));
  revalidatePatientPaths(patientId);
}

export async function detachPatientLabelAction(formData: FormData) {
  const auth = await requireAuth();
  const patientId = String(formData.get("patientId") ?? "");
  await detachLabelFromPatient(auth, patientId, String(formData.get("labelId") ?? ""));
  revalidatePatientPaths(patientId);
}

export async function createAndAttachPatientLabelAction(formData: FormData) {
  const auth = await requireAuth();
  const patientId = String(formData.get("patientId") ?? "");
  const label = await createLabel(auth, {
    name: String(formData.get("name") ?? ""),
    color: String(formData.get("color") ?? "blue"),
  });
  await attachLabelToPatient(auth, patientId, label.id);
  revalidatePatientPaths(patientId);
  revalidatePath("/labels");
}

export async function attachSessionLabelAction(formData: FormData) {
  const auth = await requireAuth();
  const sessionId = String(formData.get("sessionId") ?? "");
  await attachLabelToSession(auth, sessionId, String(formData.get("labelId") ?? ""));
  revalidateSessionPaths(sessionId);
}

export async function detachSessionLabelAction(formData: FormData) {
  const auth = await requireAuth();
  const sessionId = String(formData.get("sessionId") ?? "");
  await detachLabelFromSession(auth, sessionId, String(formData.get("labelId") ?? ""));
  revalidateSessionPaths(sessionId);
}

export async function createAndAttachSessionLabelAction(formData: FormData) {
  const auth = await requireAuth();
  const sessionId = String(formData.get("sessionId") ?? "");
  const label = await createLabel(auth, {
    name: String(formData.get("name") ?? ""),
    color: String(formData.get("color") ?? "blue"),
  });
  await attachLabelToSession(auth, sessionId, label.id);
  revalidateSessionPaths(sessionId);
  revalidatePath("/labels");
}
