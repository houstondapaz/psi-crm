import { LOCALE } from "@/lib/i18n/locale";

export function toDatetimeLocalValue(value: Date | string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function formatLocalTime(value: Date | string) {
  const localValue = toDatetimeLocalValue(value);
  if (!localValue) {
    return "";
  }

  const [hours, minutes] = localValue.slice(11, 16).split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getLocalDateKey(value: Date | string) {
  const localValue = toDatetimeLocalValue(value);
  return localValue.slice(0, 10);
}

export function isSameLocalDay(value: Date | string, day: Date) {
  return getLocalDateKey(value) === toDatetimeLocalValue(day).slice(0, 10);
}
