import { describe, it, expect } from "vitest";
import {
  filterLabelsByQuery,
  INITIAL_VISIBLE_LABELS,
  LOAD_MORE_LABELS_STEP,
  normalizeLabelQuery,
  type LabelListItem,
} from "@/lib/label-list-utils";

const sampleLabels: LabelListItem[] = [
  { id: "1", name: "TCC", color: "blue" },
  { id: "2", name: "Crise", color: "red" },
  { id: "3", name: "Agendado", color: "green" },
];

describe("normalizeLabelQuery", () => {
  it("trims and lowercases the query", () => {
    expect(normalizeLabelQuery("  TCC  ")).toBe("tcc");
  });
});

describe("filterLabelsByQuery", () => {
  it("returns all labels when the query is empty", () => {
    expect(filterLabelsByQuery(sampleLabels, "")).toEqual(sampleLabels);
  });

  it("filters labels by name", () => {
    expect(filterLabelsByQuery(sampleLabels, "tcc")).toEqual([sampleLabels[0]]);
    expect(filterLabelsByQuery(sampleLabels, "cr")).toEqual([sampleLabels[1]]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterLabelsByQuery(sampleLabels, "inexistente")).toEqual([]);
  });
});

describe("pagination constants", () => {
  it("uses matching initial and load-more steps", () => {
    expect(INITIAL_VISIBLE_LABELS).toBe(LOAD_MORE_LABELS_STEP);
  });
});
