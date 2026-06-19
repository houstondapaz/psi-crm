import { unstable_rethrow } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { toUserMessage } from "@/lib/errors";

export async function runAction(fn: () => Promise<void>): Promise<ActionState> {
  try {
    await fn();
    return {};
  } catch (error) {
    unstable_rethrow(error);
    return { error: toUserMessage(error) };
  }
}
