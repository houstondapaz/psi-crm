"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { t } from "@/lib/i18n";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6">
      <Card className="space-y-4">
        <h1 className="text-xl font-semibold text-gray-900">{t("errors.title")}</h1>
        <p className="text-sm text-gray-600">{t("errors.generic")}</p>
        <Button type="button" onClick={reset}>
          {t("errors.tryAgain")}
        </Button>
      </Card>
    </main>
  );
}
