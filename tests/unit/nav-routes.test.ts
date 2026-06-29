import { describe, it, expect } from "vitest";
import {
  APP_NAV_ITEMS,
  resolveActiveNavItem,
  resolveNavSectionLabelKey,
} from "@/lib/nav-routes";

describe("resolveActiveNavItem", () => {
  it.each([
    ["/dashboard", "/dashboard"],
    ["/patients", "/patients"],
    ["/patients/abc-123", "/patients"],
    ["/leads", "/leads"],
    ["/leads/abc-123", "/leads"],
    ["/sessions", "/sessions"],
    ["/sessions/xyz-789", "/sessions"],
    ["/products", "/products"],
    ["/labels", "/labels"],
  ])("maps %s to nav item %s", (pathname, expectedHref) => {
    expect(resolveActiveNavItem(pathname)?.href).toBe(expectedHref);
  });

  it("returns undefined for unknown routes", () => {
    expect(resolveActiveNavItem("/login")).toBeUndefined();
  });
});

describe("resolveNavSectionLabelKey", () => {
  it.each([
    ["/dashboard", "app.navAgenda"],
    ["/patients/abc-123", "app.navPatients"],
    ["/leads/abc-123", "app.navLeads"],
    ["/sessions/xyz-789", "app.navSessions"],
    ["/products", "app.navProducts"],
    ["/labels", "app.navLabels"],
  ])("maps %s to message key %s", (pathname, expectedKey) => {
    expect(resolveNavSectionLabelKey(pathname)).toBe(expectedKey);
  });
});

describe("APP_NAV_ITEMS", () => {
  it("lists every primary app section", () => {
    expect(APP_NAV_ITEMS.map((item) => item.href)).toEqual([
      "/dashboard",
      "/sessions",
      "/patients",
      "/leads",
      "/labels",
      "/products",
    ]);
  });
});
