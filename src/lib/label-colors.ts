import type { MessageKey } from "@/lib/i18n";

export const LABEL_COLORS = [
  "mintPastel",
  "yellowPastel",
  "orangePastel",
  "pinkPastel",
  "lavenderPastel",
  "green",
  "yellow",
  "orange",
  "red",
  "purple",
  "greenDark",
  "yellowDark",
  "orangeDark",
  "redDark",
  "purpleDark",
  "bluePastel",
  "skyPastel",
  "limePastel",
  "pinkLight",
  "grayLight",
  "blue",
  "sky",
  "lime",
  "pink",
  "gray",
  "blueDark",
  "tealDark",
  "greenOlive",
  "magenta",
  "grayDark",
] as const;

export type LabelColor = (typeof LABEL_COLORS)[number];

const LEGACY_LABEL_COLORS = [
  "slate",
  "amber",
  "teal",
  "violet",
] as const;

export type LegacyLabelColor = (typeof LEGACY_LABEL_COLORS)[number];

export const DEFAULT_LABEL_COLOR: LabelColor = "green";

const LEGACY_COLOR_ALIASES: Record<string, LabelColor> = {
  slate: "grayLight",
  red: "redDark",
  orange: "orange",
  amber: "yellow",
  green: "green",
  teal: "tealDark",
  blue: "blue",
  violet: "purpleDark",
  pink: "pink",
};

export const LABEL_COLOR_MESSAGE_KEYS = {
  mintPastel: "labelColors.mintPastel",
  yellowPastel: "labelColors.yellowPastel",
  orangePastel: "labelColors.orangePastel",
  pinkPastel: "labelColors.pinkPastel",
  lavenderPastel: "labelColors.lavenderPastel",
  green: "labelColors.green",
  yellow: "labelColors.yellow",
  orange: "labelColors.orange",
  red: "labelColors.red",
  purple: "labelColors.purple",
  greenDark: "labelColors.greenDark",
  yellowDark: "labelColors.yellowDark",
  orangeDark: "labelColors.orangeDark",
  redDark: "labelColors.redDark",
  purpleDark: "labelColors.purpleDark",
  bluePastel: "labelColors.bluePastel",
  skyPastel: "labelColors.skyPastel",
  limePastel: "labelColors.limePastel",
  pinkLight: "labelColors.pinkLight",
  grayLight: "labelColors.grayLight",
  blue: "labelColors.blue",
  sky: "labelColors.sky",
  lime: "labelColors.lime",
  pink: "labelColors.pink",
  gray: "labelColors.gray",
  blueDark: "labelColors.blueDark",
  tealDark: "labelColors.tealDark",
  greenOlive: "labelColors.greenOlive",
  magenta: "labelColors.magenta",
  grayDark: "labelColors.grayDark",
} as const satisfies Record<LabelColor, MessageKey>;

export const LABEL_COLOR_HEX: Record<LabelColor, string> = {
  mintPastel: "#B3F1B8",
  yellowPastel: "#F5EA62",
  orangePastel: "#FFAB4A",
  pinkPastel: "#FF8F94",
  lavenderPastel: "#DFC0EB",
  green: "#61BD4F",
  yellow: "#F2D600",
  orange: "#FF9F1A",
  red: "#EB5A46",
  purple: "#C377E0",
  greenDark: "#519839",
  yellowDark: "#D9B51C",
  orangeDark: "#CD8313",
  redDark: "#B04632",
  purpleDark: "#89609E",
  bluePastel: "#B3D4FF",
  skyPastel: "#8FDFEB",
  limePastel: "#B3F1B8",
  pinkLight: "#F5B3D9",
  grayLight: "#D3D3D3",
  blue: "#579DFF",
  sky: "#00C2E0",
  lime: "#51E898",
  pink: "#FF78CB",
  gray: "#969696",
  blueDark: "#0C66E4",
  tealDark: "#0079BF",
  greenOlive: "#4BCE97",
  magenta: "#943D73",
  grayDark: "#5A5A5A",
};

export function getLabelTextColor(hex: string): string {
  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  const luma = 0.299 * red + 0.587 * green + 0.114 * blue;
  return luma > 160 ? "#172B4D" : "#FFFFFF";
}

export function getLabelColorStyle(color: LabelColor) {
  const backgroundColor = LABEL_COLOR_HEX[color];
  return {
    backgroundColor,
    color: getLabelTextColor(backgroundColor),
  };
}

export function resolveLabelColor(color: string): LabelColor {
  if ((LABEL_COLORS as readonly string[]).includes(color)) {
    return color as LabelColor;
  }
  return LEGACY_COLOR_ALIASES[color] ?? DEFAULT_LABEL_COLOR;
}

export function isLabelColor(value: string): value is LabelColor {
  return (LABEL_COLORS as readonly string[]).includes(value);
}

export function isStoredLabelColor(value: string): boolean {
  return isLabelColor(value) || value in LEGACY_COLOR_ALIASES;
}

export const LABEL_COLOR_OPTION_STYLES: Record<
  LabelColor,
  { backgroundColor: string; color: string }
> = Object.fromEntries(
  LABEL_COLORS.map((color) => [color, getLabelColorStyle(color)]),
) as Record<LabelColor, { backgroundColor: string; color: string }>;
