import type { MessageKey } from "@/lib/i18n";

export type AppNavItem = {
  href: string;
  labelKey: MessageKey;
  match: (pathname: string) => boolean;
};

export const APP_NAV_ITEMS: AppNavItem[] = [
  {
    href: "/dashboard",
    labelKey: "app.navAgenda",
    match: (pathname) =>
      pathname === "/dashboard" || pathname.startsWith("/dashboard/"),
  },
  {
    href: "/sessions",
    labelKey: "app.navSessions",
    match: (pathname) =>
      pathname === "/sessions" || pathname.startsWith("/sessions/"),
  },
  {
    href: "/patients",
    labelKey: "app.navPatients",
    match: (pathname) =>
      pathname === "/patients" || pathname.startsWith("/patients/"),
  },
  {
    href: "/leads",
    labelKey: "app.navLeads",
    match: (pathname) =>
      pathname === "/leads" || pathname.startsWith("/leads/"),
  },
  {
    href: "/labels",
    labelKey: "app.navLabels",
    match: (pathname) =>
      pathname === "/labels" || pathname.startsWith("/labels/"),
  },
  {
    href: "/products",
    labelKey: "app.navProducts",
    match: (pathname) =>
      pathname === "/products" || pathname.startsWith("/products/"),
  }
];

export function resolveActiveNavItem(pathname: string): AppNavItem | undefined {
  return APP_NAV_ITEMS.find((item) => item.match(pathname));
}

export function resolveNavSectionLabelKey(pathname: string): MessageKey {
  return resolveActiveNavItem(pathname)?.labelKey ?? "common.appName";
}
