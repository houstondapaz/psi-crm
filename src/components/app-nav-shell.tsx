"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { APP_NAV_ITEMS, resolveActiveNavItem } from "@/lib/nav-routes";
import { t } from "@/lib/i18n";
import type { MessageKey } from "@/lib/i18n";

type AppNavShellProps = {
  userName: string;
  signOutButton: ReactNode;
};

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

function navLinkClassName(isActive: boolean, variant: "desktop" | "drawer") {
  if (variant === "desktop") {
    return isActive
      ? "border-b-2 border-gray-900 pb-0.5 text-gray-900 transition hover:text-gray-900"
      : "border-b-2 border-transparent pb-0.5 text-gray-600 transition hover:text-gray-900";
  }

  return isActive
    ? "rounded-sm bg-gray-100 px-3 py-2 font-medium text-gray-900"
    : "rounded-sm px-3 py-2 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900";
}

function NavLinks({
  pathname,
  variant,
  onNavigate,
}: {
  pathname: string;
  variant: "desktop" | "drawer";
  onNavigate?: () => void;
}) {
  const activeItem = resolveActiveNavItem(pathname);

  if (variant === "desktop") {
    return (
      <nav className="flex gap-4 text-sm font-medium">
        {APP_NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={navLinkClassName(activeItem?.href === item.href, "desktop")}
          >
            {t(item.labelKey)}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex flex-col gap-1 text-sm">
      {APP_NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={navLinkClassName(activeItem?.href === item.href, "drawer")}
        >
          {t(item.labelKey)}
        </Link>
      ))}
    </nav>
  );
}

function MobilePageTitle({ labelKey }: { labelKey: MessageKey }) {
  return (
    <span className="truncate text-sm font-medium text-gray-600">
      {t(labelKey)}
    </span>
  );
}

export function AppNavShell({ userName, signOutButton }: AppNavShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeItem = resolveActiveNavItem(pathname);
  const pageLabelKey = activeItem?.labelKey ?? "common.appName";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-6">
            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center rounded-sm p-2 text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 md:hidden"
              aria-expanded={menuOpen}
              aria-controls="app-mobile-nav"
              aria-label={menuOpen ? t("app.closeMenu") : t("app.openMenu")}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            <div className="flex min-w-0 items-center gap-2 md:gap-6">
              <Link
                href="/dashboard"
                className="shrink-0 text-lg font-bold text-gray-900"
              >
                {t("common.appName")}
              </Link>

              <span className="text-gray-300 md:hidden" aria-hidden="true">
                ·
              </span>
              <div className="min-w-0 md:hidden">
                <MobilePageTitle labelKey={pageLabelKey} />
              </div>

              <div className="hidden md:block">
                <NavLinks pathname={pathname} variant="desktop" />
              </div>
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <span className="text-sm text-gray-600">{userName}</span>
            {signOutButton}
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-gray-900/40"
            aria-label={t("app.closeMenu")}
            onClick={() => setMenuOpen(false)}
          />
          <aside
            id="app-mobile-nav"
            className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl"
          >
            <div className="border-b border-gray-200 px-4 py-4">
              <Link
                href="/dashboard"
                className="text-lg font-bold text-gray-900"
                onClick={() => setMenuOpen(false)}
              >
                {t("common.appName")}
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
              <NavLinks
                pathname={pathname}
                variant="drawer"
                onNavigate={() => setMenuOpen(false)}
              />
            </div>

            <div className="border-t border-gray-200 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-sm text-gray-600">{userName}</span>
                {signOutButton}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
