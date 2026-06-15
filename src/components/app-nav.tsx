// HyperUI Application UI — Headers: https://www.hyperui.dev/components/application-ui/headers
import Link from "next/link";
import { signOut } from "@/lib/auth";
import { requireAuth } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";

export async function AppNav() {
  const auth = await requireAuth();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-lg font-bold text-gray-900">
            {t("common.appName")}
          </Link>
          <nav className="flex gap-4 text-sm font-medium text-gray-600">
            <Link
              href="/dashboard"
              className="transition hover:text-gray-900"
            >
              {t("app.navAgenda")}
            </Link>
            <Link
              href="/patients"
              className="transition hover:text-gray-900"
            >
              {t("app.navPatients")}
            </Link>
            <Link
              href="/sessions"
              className="transition hover:text-gray-900"
            >
              {t("app.navSessions")}
            </Link>
            <Link
              href="/products"
              className="transition hover:text-gray-900"
            >
              {t("app.navProducts")}
            </Link>
            <Link
              href="/labels"
              className="transition hover:text-gray-900"
            >
              {t("app.navLabels")}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-gray-600 sm:inline">
            {auth.name}
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button variant="secondary" type="submit">
              {t("app.signOut")}
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
