import { AppNavShell } from "@/components/app-nav-shell";
import { SignOutButton } from "@/components/sign-out-button";
import { requireAuth } from "@/lib/auth/session";
import { db } from "@/prisma/db";
import { asEntityId } from "@/services/types";

export async function AppNav() {
  const auth = await requireAuth();
  const practice = await db.orm.Practice
    .where((p) => p.id.eq(asEntityId(auth.practiceId)))
    .first();

  return (
    <AppNavShell
      practiceName={practice?.name ?? ""}
      userName={auth.name}
      signOutButton={<SignOutButton />}
    />
  );
}
