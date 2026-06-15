import { LOCALE } from "./locale";

export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString(LOCALE, options);
}

export function formatDateTime(date: Date, options?: Intl.DateTimeFormatOptions) {
  return date.toLocaleString(LOCALE, options);
}
