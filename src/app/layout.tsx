import type { Metadata } from "next";
import { LOCALE, t } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: t("common.appName"),
  description: t("app.metadataDescription"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={LOCALE}>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
