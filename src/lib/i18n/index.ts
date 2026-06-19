import {
  LABEL_COLOR_MESSAGE_KEYS,
  type LabelColor,
} from "@/lib/label-colors";
import { messagesPtBr } from "./messages/pt-BR";
import type { LeafPaths } from "./types";

export type MessageKey = LeafPaths<typeof messagesPtBr>;

export const WEEKDAY_MESSAGE_KEYS = [
  "agenda.weekdayMon",
  "agenda.weekdayTue",
  "agenda.weekdayWed",
  "agenda.weekdayThu",
  "agenda.weekdayFri",
  "agenda.weekdaySat",
  "agenda.weekdaySun",
] as const satisfies readonly MessageKey[];

export { LOCALE } from "./locale";
export { formatDate, formatDateTime, formatSessionDateTime, formatTime, formatWeekdayShort } from "./format";

type InterpolationValues = Record<string, string | number>;

function resolvePath(path: string): string {
  const parts = path.split(".");
  let current: unknown = messagesPtBr;

  for (const part of parts) {
    if (current === null || typeof current !== "object" || !(part in current)) {
      throw new Error(`Missing message key: ${path}`);
    }
    current = (current as Record<string, unknown>)[part];
  }

  if (typeof current !== "string") {
    throw new Error(`Message key is not a string: ${path}`);
  }

  return current;
}

export function t(key: MessageKey, values?: InterpolationValues): string {
  let message = resolvePath(key);

  if (values) {
    for (const [name, value] of Object.entries(values)) {
      message = message.replaceAll(`{${name}}`, String(value));
    }
  }

  return message;
}

export function getWeekdayLabels(): string[] {
  return WEEKDAY_MESSAGE_KEYS.map((key) => t(key));
}

export function getLabelColorLabel(color: LabelColor): string {
  return t(LABEL_COLOR_MESSAGE_KEYS[color]);
}

const SESSION_STATUS_MESSAGE_KEYS = {
  scheduled: "sessions.statusScheduled",
  completed: "sessions.statusCompleted",
} as const satisfies Record<string, MessageKey>;

export function getSessionStatusLabel(status: string): string {
  const key =
    SESSION_STATUS_MESSAGE_KEYS[status as keyof typeof SESSION_STATUS_MESSAGE_KEYS];
  return key ? t(key) : status;
}
