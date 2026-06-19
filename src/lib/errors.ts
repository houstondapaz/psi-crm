import { t, type MessageKey } from "@/lib/i18n";

export class AppError extends Error {
  readonly messageKey: MessageKey;

  constructor(messageKey: MessageKey) {
    super(messageKey);
    this.name = "AppError";
    this.messageKey = messageKey;
  }
}

const LEGACY_ERROR_MESSAGES: Record<string, MessageKey> = {
  "Patient not found": "errors.patientNotFound",
  "Session not found": "errors.sessionNotFound",
  "Invalid label color": "errors.invalidLabelColor",
  "Label name is required": "errors.labelNameRequired",
  "Label name already exists": "errors.labelNameExists",
  "Label not found": "errors.labelNotFound",
  "Label not attached to patient": "errors.labelNotAttachedToPatient",
  "Label not attached to session": "errors.labelNotAttachedToSession",
  "Annotation not found": "errors.annotationNotFound",
  "Reminder not found": "errors.reminderNotFound",
  "File link not found": "errors.fileLinkNotFound",
  "Product not found": "errors.productNotFound",
  "Referral not found": "errors.referralNotFound",
  "Invalid registration token": "errors.invalidRegistrationToken",
};

export function toUserMessage(error: unknown): string {
  if (error instanceof AppError) {
    return t(error.messageKey);
  }

  if (error instanceof Error) {
    const messageKey = LEGACY_ERROR_MESSAGES[error.message];
    if (messageKey) {
      return t(messageKey);
    }
  }

  console.error(error);
  return t("errors.generic");
}
