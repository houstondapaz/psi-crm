import { LOCALE } from "./locale";

const SESSION_DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString(LOCALE, options);
}

export function formatDateTime(date: Date, options?: Intl.DateTimeFormatOptions) {
  return date.toLocaleString(LOCALE, options);
}

export function formatSessionDateTime(date: Date) {
  return formatDateTime(date, SESSION_DATE_TIME_OPTIONS);
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatWeekdayShort(date: Date) {
  return formatDate(date, { weekday: "short" });
}
