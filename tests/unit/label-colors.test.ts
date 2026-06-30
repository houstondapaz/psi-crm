import { describe, it, expect } from "vitest";
import {
  DEFAULT_LABEL_COLOR,
  LABEL_COLORS,
  LABEL_COLOR_HEX,
  isLabelColor,
  isStoredLabelColor,
  resolveLabelColor,
} from "@/lib/label-colors";

describe("LABEL_COLORS", () => {
  it("defines 30 selectable colors", () => {
    expect(LABEL_COLORS).toHaveLength(30);
  });

  it("provides a hex value for every color", () => {
    for (const color of LABEL_COLORS) {
      expect(LABEL_COLOR_HEX[color]).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });
});

describe("resolveLabelColor", () => {
  it("keeps valid palette colors", () => {
    expect(resolveLabelColor("green")).toBe("green");
    expect(resolveLabelColor("blueDark")).toBe("blueDark");
  });

  it("maps legacy colors to the new palette", () => {
    expect(resolveLabelColor("slate")).toBe("grayLight");
    expect(resolveLabelColor("teal")).toBe("tealDark");
    expect(resolveLabelColor("violet")).toBe("purpleDark");
  });

  it("falls back to the default color for unknown values", () => {
    expect(resolveLabelColor("unknown")).toBe(DEFAULT_LABEL_COLOR);
  });
});

describe("isStoredLabelColor", () => {
  it("accepts palette and legacy colors", () => {
    expect(isStoredLabelColor("green")).toBe(true);
    expect(isStoredLabelColor("slate")).toBe(true);
    expect(isLabelColor("green")).toBe(true);
  });

  it("rejects unknown colors", () => {
    expect(isStoredLabelColor("not-a-color")).toBe(false);
  });
});
