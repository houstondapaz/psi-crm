import { AppNavShell } from "@/components/app-nav-shell";
import { SignOutButton } from "@/components/sign-out-button";
import { requireAuth } from "@/lib/auth/session";

export async function AppNav() {
  const auth = await requireAuth();

  return (
    <AppNavShell userName={auth.name} signOutButton={<SignOutButton />} />
  );
}
