import Link from "next/link";
import { registerAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { t } from "@/lib/i18n";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 p-4 sm:p-6">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-bold text-gray-900">{t("register.title")}</h1>
        <p className="mt-1 text-sm text-gray-600">{t("register.subtitle")}</p>
      </div>
      <Card>
        <form action={registerAction} className="space-y-4">
          <div>
            <Label htmlFor="practiceName">{t("register.practiceName")}</Label>
            <Input
              className="mt-1"
              id="practiceName"
              name="practiceName"
              required
            />
          </div>
          <div>
            <Label htmlFor="userName">{t("register.userName")}</Label>
            <Input className="mt-1" id="userName" name="userName" required />
          </div>
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
          <div>
            <Label htmlFor="registrationToken">{t("register.registrationToken")}</Label>
            <Input
              className="mt-1"
              id="registrationToken"
              name="registrationToken"
              type="password"
            />
          </div>
          <Button className="w-full" type="submit">
            {t("register.submit")}
          </Button>
        </form>
      </Card>
      <p className="text-center text-sm text-gray-600 sm:text-left">
        {t("register.hasAccount")}{" "}
        <Link
          className="font-medium text-gray-900 underline transition hover:text-gray-600"
          href="/login"
        >
          {t("register.loginLink")}
        </Link>
      </p>
    </main>
  );
}
