import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { AuthContext } from "@/services/types";
import { asEntityId } from "@/services/types";

export async function requireAuth(): Promise<
  AuthContext & { name: string; email: string }
> {
  const session = await auth();
  if (!session?.user?.id || !session.user.practiceId) {
    redirect("/login");
  }

  return {
    practiceId: session.user.practiceId,
    userId: asEntityId(session.user.id),
    name: session.user.name ?? "",
    email: session.user.email ?? "",
  };
}
