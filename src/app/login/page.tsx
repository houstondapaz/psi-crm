import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { t } from "@/lib/i18n";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 p-4 sm:p-6">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-bold text-gray-900">{t("login.title")}</h1>
        <p className="mt-1 text-sm text-gray-600">{t("login.subtitle")}</p>
      </div>
      <Card>
        <ActionForm action={loginAction} className="space-y-4">
          <div>
            <Label htmlFor="email">{t("common.email")}</Label>
            <Input className="mt-1" id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">{t("common.password")}</Label>
            <Input
              className="mt-1"
              id="password"
              name="password"
              type="password"
              required
            />
          </div>
          <Button className="w-full" type="submit">
            {t("login.submit")}
          </Button>
        </ActionForm>
      </Card>
      <p className="text-center text-sm text-gray-600 sm:text-left">
        {t("login.noAccount")}{" "}
        <Link
          className="font-medium text-gray-900 underline transition hover:text-gray-600"
          href="/register"
        >
          {t("login.registerLink")}
        </Link>
      </p>
    </main>
  );
}
