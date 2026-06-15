import { messagesPtBr } from "./messages/pt-BR";
import type { LeafPaths } from "./types";

export type MessageKey = LeafPaths<typeof messagesPtBr>;

export { LOCALE } from "./locale";
export { formatDate, formatDateTime } from "./format";

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

export function t(key: MessageKey): string {
  return resolvePath(key);
}
